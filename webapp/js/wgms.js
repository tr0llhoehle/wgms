var editListView;
var shoppingListview;

var diffPollInterval = 5000;
var retryInterval = 5000;

//An entry in the list contains the following attributes:
//  name - the name of the item
//  id - an unique identifier (always unique in relation to the list) to generate 
//  valid html-ids. If the id is not unique in relation to the server-data
//  (so it is a temp id) it will be < 0.
function ListEntry(id, name) {
  this.id = id;
  this.name = name;
}

//definition of an anonymous class which acts as a list fo ListEntries.
var list = {
  //contains all unchecked ListEntries which are synced with the server. 
  uncheckedEntries: [],
  //contains all unchecked ListEntries which don't have their new state
  //synced with the server.
  uUncheckedEntries: [],
  //contains all checked ListEntries which are synced with the server. 
  checkedEntries: [],
  //contains all checked ListEntries which don't have their new state
  //synced with the server.
  uCheckedEntries: [],
  //contains all newly created ListEntries which weren't successfully 
  //transmitted to the server.
  addedEntries: [],
  //contains all deleted ListEntries which weren't successfully transmitted
  //to the server.
  deletedEntries: [],
  //TODO: this may cause underflows when the app runs a long time, I suppose...
  nextId: -1,

  //timers for the different actions we do with the server:
  diffPollTimer: setInterval(function(){list.diffPoll()}, diffPollInterval),
  //if one of the following variables is 0 it means no problem has occurred
  //while transmitting information to the server.
  deleteEntriesTimer: 0,
  addEntriesTimer: 0,
  checkEntriesTimer: 0,
  uncheckEntriesTimer: 0,
  doneShoppingTimer: 0,

  addEntry: function(name) {
    this.addedEntries.push(new ListEntry(this.nextId, name));
    this.nextId -= 1;
    if(this.addEntriesTimer == 0) {
      this.transmitAddedEntries();
    }
  },

  removeEntry: function(id, inUncheckedEntries) {
    var arr;
    if(inUncheckedEntries) {
      arr = uncheckedEntries;
    } else {
      arr = checkedEntries;
    }
    for(var i = 0; i < arr.length; ++i) {
      if(id == arr[i].id) {
        deletedEntries.push(arr[i]);
        arr.splice(i, 1);
        if(this.deleteEntriesTimer == 0) {
          this.transmitDeletedEntries();
        }
        break;
      }
    }
  },

  //This method will add a ListEntry from either uncheckedEntries or
  //uUncheckedEntries to the uCheckedEntries-Array and start the sync
  //with the server.
  checkEntry: function(id) {
    var entry;
    var done = false;
    for(var i = 0; i < this.uncheckedEntries.length; ++i) {
      if(this.uncheckedEntries[i].id == id) {
        entry = jQuery.extend(true, {}, this.uncheckedEntries[i]);
        this.uncheckedEntries.splice(i, 1);
        done = true;
        break;
      }
    }
    if(!done) {
      for(var i = 0; i < this.uUncheckedEntries.length; ++i) {
        if(this.uUncheckedEntries[i].id == id) {
          entry = jQuery.extend(true, {}, this.uUncheckedEntries[i]);
          this.uUncheckedEntries.splice(i, 1);
          done = true;
          break;
        }
      }
    }
    if(done) {
      this.uCheckedEntries.push(entry);
      animations.startTransmittingEntries([entry]);
      this.transmitCheckedEntries();
    }
  },

  //See checkEntry, just for unchecking! ;-)
  uncheckEntry: function(id) {
    var entry;
    var done = false;
    for(var i = 0; i < this.checkedEntries.length; ++i) {
      if(this.checkedEntries[i].id == id) {
        entry = jQuery.extend(true, {}, this.checkedEntries[i]);
        this.checkedEntries.splice(i, 1);
        done = true;
        break;
      }
    }
    if(!done){
      for(var i = 0; i < this.uCheckedEntries.length; ++i) {
        if(this.uCheckedEntries[i].id == id) {
          entry = jQuery.extend(true, {}, this.uCheckedEntries[i]);
          this.uUncheckedEntries.splice(i, 1);
          done = true;
          break;
        }
      }
    }
    if(done) {
      this.uUncheckedEntries.push(entry);
      animations.startTransmittingEntries([entry]);
      this.transmitUncheckedEntries();
    }
  },
  
  doneShopping: function(sum) {
    this.transmitDoneShopping(sum);    
  },

  diffPoll: function() {
    //TODO: le magic
    var dataString = "";
    //TODO le small magic
    $.post('../DiffPoll', {data: dataString}, function(res){
    	var jdata = $.parseJSON(res);
    	for(var i=0; i<jdata.length; i++) {
    		/*if(jdata[i].state == 0) {
    			list.addedEntries.push(new ListEntry(jdata[i].id[0], jdata[i].name[0]));
    		}*/
    		if(jdata[i].state == 1) {
    			for(var j=0; j<list.uncheckedEntries.length; j++) {
    				if(list.uncheckedEntries[j].id == jdata[i].id[0]) {
    					list.uncheckedEntries.splice(j,1);
    					//'#sli'+id
    					$('#sli'+jdata[i].id[0]).remove();
    					$('#eli'+jdata[i].id[0]).remove();
    					break;
    				}
    			}    			
    			list.checkedEntries.push(new ListEntry(jdata[i].id[0], jdata[i].name[0]));
    			var newUiEl = '<li data-icon="check" id="' + jdata[i].id[0] + '"><a>' + jdata[i].name[0] + '</a></li>';
    			$('#shoppingListView').append(newUiEl)
    			$('#editListView').append(newUiEl)		
    		}
    		if(jdata[i].state == 2) {
    			for(var j=0; j<list.checkedEntries.length; j++) {
    				if(list.checkedEntries[j].id == jdata[i].id[0]) {
    					list.checkedEntries.splice(j,1);
    					$('#sli'+jdata[i].id[0]).remove();
    					$('#eli'+jdata[i].id[0]).remove();
    					break;
    				}
    			}    			
    			list.uncheckedEntries.push(new ListEntry(jdata[i].id[0], jdata[i].name[0]));
    			var newUiEl = '<li data-icon="troll-blank" id="' + jdata[i].id[0] + '"><a>' + jdata[i].name[0] + '</a></li>';
    			$('#shoppingListView').append(newUiEl)
    			$('#editListView').append(newUiEl)	
    		}
    		if(jdata[i].state == 3) {
    			for(var j=0; j<list.uncheckedEntries.length; j++) {
    				if(list.uncheckedEntries[j].id == jdata[i].id[0]) {
    					list.uncheckedEntries.splice(j,1);
    					$('#sli'+jdata[i].id[0]).remove();
    					$('#eli'+jdata[i].id[0]).remove();
    					break;
    				}
    			}
    			for(var j=0; j<list.checkedEntries.length; j++) {
    				if(list.checkedEntries[j].id == jdata[i].id[0]) {
    					list.checkedEntries.splice(j,1);
    					$('#sli'+jdata[i].id[0]).remove();
    					$('#eli'+jdata[i].id[0]).remove();
    					break;
    				}
    			}
    			list.deletedEntries.push(new ListEntry(jdata[i].id[0], jdata[i].name[0]));
    		}
    	}
    	});
  },
  
  initialRequest: function() {
  	var dataString = "";
    //TODO le small magic
    $.post('../InitialRequest', {data: dataString}, function(res){
    	var jdata = $.parseJSON(res);
    	for(var i=0; i<jdata.length; i++) {
    		if(jdata[i].state == 0) {
    			list.addedEntries.push(new ListEntry(jdata[i].id[0], jdata[i].name[0]));
    			var newUiEl = '<li data-icon="troll-blank" id="' + jdata[i].id[0] + '"><a>' + jdata[i].name[0] + '</a></li>';
    			$('#shoppingListView').prepend(newUiEl)
    			$('#editListView').prepend(newUiEl)
    		}
    		if(jdata[i].state == 1) {
    			list.checkedEntries.push(new ListEntry(jdata[i].id[0], jdata[i].name[0]));
    			var newUiEl = '<li data-icon="check" id="' + jdata[i].id[0] + '"><a>' + jdata[i].name[0] + '</a></li>';
    			$('#shoppingListView').append(newUiEl)
    			$('#editListView').append(newUiEl)
    		}
    		if(jdata[i].state == 2) {
    			list.uncheckedEntries.push(new ListEntry(jdata[i].id[0], jdata[i].name[0]));
    			var newUiEl = '<li data-icon="troll-blank" id="' + jdata[i].id[0] + '"><a>' + jdata[i].name[0] + '</a></li>';
    			$('#shoppingListView').prepend(newUiEl)
    			$('#editListView').prepend(newUiEl)
    		}
    		if(jdata[i].state == 3) {
    			list.deletedEntries.push(new ListEntry(jdata[i].id[0], jdata[i].name[0]));
    		}
    		/*switch(jdata[i].state) {
    			case "0":
    				this.addedEntries.push(new ListEntry(jdata[i].id, jdata[i].name));
    				break;
    			case "1":
    				this.checkedEntries.push(new ListEntry(jdata[i].id, jdata[i].name));
    				break;
    			case "2":
    				alert("state:"+jdata[i].state+" id"+jdata[i].id);
    				this.uncheckedEntries.push(new ListEntry(jdata[i].id, jdata[i].name));
    				break;
    			case "3":
    				this.deletedEntries.push(new ListEntry(jdata[i].id, jdata[i].name));
    				break;
    		}*/
    	}});
  },

  transmitDeletedEntries: function() {
    var successful = false;
    var tempDeletedEntries = this.deletedEntries;
    //TODO: Do the actual transmitting <-- ...
    //successful = confirm("Simulate transmission of created entries to the server.\nSuccess?");
    //... -->
    var dataString = $.toJSON(tempDeletedEntries);
    $.post('../DeleteEntries', {data: dataString}, function(res){
    	successful = true;
      clearTimeout(list.deletedEntriesTimer);
      list.deleteEntriesTimer = 0;
      list.deletedEntries.splice(0, tempDeletedEntries.length);
    });
    if(successful) {
      this.deleteEntriesTimer = setTimeout(function(){list.transmitDeletedEntries()}, retryInterval);
    }
  },
  
  transmitAddedEntries: function() {
    var successful = false; //TODO: shouldn't be initialised with true. Just for testing...
    var tempAddedEntries = this.addedEntries;
    var names = new Array();
    //TODO: Do the actual transmitting <-- ...
    //successful = confirm("Simulate transmission of created entries to the server.\nSuccess?");
    //... -->   
    for (i in tempAddedEntries) {
      names.push(tempAddedEntries[i].name);
    }
    var dataString = $.toJSON(names);
    $.post('../AddEntries', {data: dataString}, function(res){
    	successful = true;
      clearTimeout(list.addEntriesTimer);
      list.addEntriesTimer = 0;
      var serverIds = $.parseJSON(res); //TODO: DOES IT WORK? O_O
      for(var i = 0; i < tempAddedEntries.length; ++i) {
        list.uncheckedEntries.push(new ListEntry(serverIds[i], tempAddedEntries[i].name));
      }
      list.addedEntries.splice(0, tempAddedEntries.length);
    });
    if(!successful) {
      this.addEntriesTimer = setTimeout(function(){list.transmitAddedEntries()}, retryInterval);
    }
  },

  transmitCheckedEntries: function() {
    var successful = false;
    var tempCheckedEntries = this.uCheckedEntries;
    var ids = new Array();
    //TODO: Do the actual transmitting <-- ...
    //successful = confirm("Simulate transmission of newly checked entries to the server.\nSuccess?");
    //... -->
    for (i in tempCheckedEntries) {
      ids.push(tempCheckedEntries[i].id);
    }
    var dataString = $.toJSON(ids);
    $.post('../CheckEntries', {data: dataString}, function(res){
    	successful = true;
      clearTimeout(this.checkEntriesTimer);
      list.checkEntriesTimer = 0;
      list.checkedEntries = list.checkedEntries.concat(tempCheckedEntries);
      animations.addCheckedEntries(tempCheckedEntries);
      list.uCheckedEntries.splice(0, tempCheckedEntries.length);
    });
    if(!successful) {
      this.checkEntriesTimer = setTimeout(function(){list.transmitCheckedEntries()}, retryInterval);
    }
  },

  transmitUncheckedEntries: function() {
    var successful = false;
    var tempUncheckedEntries = this.uUncheckedEntries;
    var ids = new Array();
    //TODO: Do the actual transmitting <-- ...
    //successful = confirm("Simulate transmission of newly unchecked entries to the server.\nSuccess?");
    //... -->
    for (i in tempUncheckedEntries) {
      ids.push(tempUncheckedEntries[i].id);
    }
    var dataString = $.toJSON(tempUncheckedEntries);
    $.post('../UncheckEntries', {data: dataString}, function(res){
    	successful = true;
      clearTimeout(this.uncheckEntriesTimer);
      list.uncheckEntriesTimer = 0;
      list.uncheckedEntries = list.uncheckedEntries.concat(tempUncheckedEntries);
      animations.addUncheckedEntries(tempUncheckedEntries);
      list.uUncheckedEntries.splice(0, tempUncheckedEntries.length);
    });
    if(!successful) {
      this.uncheckEntriesTimer = setTimeout(function(){list.transmitUncheckedEntries()}, retryInterval);
    }
  },

  transmitDoneShopping: function(sum) {
    var successful = false;
    var tempCheckedEntries = this.uncheckedEntries;
    var ids = new Array();
    for (i in tempCheckedEntries) {
      ids.push(tempCheckedEntries[i].id);
    }
    var jsonObject = {
      sum: sum,
      ids: ids,
    }
    //TODO: Do the actual transmitting <-- ...
    //successful = confirm("Simulate transmission of newly unchecked entries to the server.\nSuccess?");
    //... -->
    var dataString = $.toJSON(jsonObject);
    $.post('../DoneShopping', {data: dataString}, function(res){
      successful = true;
      clearTimeout(list.doneShoppingTimer);
      list.doneShoppingTimer = 0;
      list.checkedEntries.splice(0, tempCheckedEntries.length);
    });
    if(!successful) {
      this.doneShoppingTimer = setTimeout(function(){list.transmitDoneShopping(sum)}, retryInterval);
    } 
  },
}

var animations = {
  addEntriesFront: function(entries) {

  },

  addEntriesBack: function(entries) {

  },

  checkEntries: function(entries) {

  },

  uncheckEntries: function(entries) {

  },

  startTransmitting: function(entries, list) {

  },

  stopTransmitting: function(entries, list) {

  },

  startTransmittingEntries: function(entries, list) {
    //TODO: doesn't work yet. :( 
    //Need an identification here that the transmitting is running...
    for (i in entries) {
      var uiId = '#' + list + entries[i].id;
      var newUiEl = '<li data-icon="delete" id="' + uiId + '"><a>' + entries[i].name + '</a></li>';
      $('#shoppingListView').listview('refresh');
    }
  },

  addUncheckedEntries: function(entries) {
    for (i in entries) {
      var uiId = '#sli' + entries[i].id;
      var newUiEl = '<li data-icon="check" id="' + uiId + '"><a>' + entries[i].name + '</a></li>';
      $(uiId).slideUp(700).delay(100).queue(function() {
        $(uiId).remove();
        $('#shoppingListView').prepend(newUiEl).listview('refresh');
      });
    }
  },

  addCheckedEntries: function(entries) {
    for (i in entries) {
      var uiId = '#sli' + entries[i].id;
      var newUiEl = '<li data-icon="check" id="' + uiId + '"><a>' + entries[i].name + '</a></li>';

      $(uiId).slideUp(700).delay(100).queue(function() {
        $(uiId).remove();
        $('#shoppingListView').append(newUiEl).listview('refresh');
      });
    }
  },
}

/*
  uncheckedEntries: [],
  uUncheckedEntries: [],
  checkedEntries: [],
  uCheckedEntries: [],
  addedEntries: [],
  deletedEntries: [],
*/
function populateListView(listview,icon) {
	/* TODO: doesn't work anymore since the arrays .. are DIFFERENT! :-O
    for (var i = 0; i < list.entries.length; i++) {
		var listItem = document.createElement('li');
        listItem.setAttribute('id','li'+i);
        listItem.setAttribute('data-icon',icon);
        listItem.setAttribute('data-corners',"false");
        listItem.setAttribute('data-shadow',"false");
        listItem.setAttribute('data-iconshadow',"true");
        listItem.setAttribute('data-wrapperels',"div");
        listItem.setAttribute('data-iconpos',"right");
        listItem.setAttribute('data-theme',"c");
        listItem.innerHTML = "<a>"+list.entries[i].name+"</a>";
        
        listview.appendChild(listItem);
        //$('listview').listview();
        //$('listview').listview('refresh');
	}*/
	//$("#shopping").trigger("create");
}

function initialiseListView() {
  for (i in list.uncheckedEntries) {
    var editListItem = document.createElement('li');
    editListItem.setAttribute('id','eli'+list.uncheckedEntries[i].id);
    editListItem.setAttribute('data-icon','delete');
    editListItem.setAttribute('data-corners',"false");
    editListItem.setAttribute('data-shadow',"false");
    editListItem.setAttribute('data-iconshadow',"true");
    editListItem.setAttribute('data-wrapperels',"div");
    editListItem.setAttribute('data-iconpos',"right");
    editListItem.setAttribute('data-theme',"c");
    editListItem.innerHTML = "<a>"+list.uncheckedEntries[i].name+"</a>";

    var shoppingListItem = document.createElement('li');
    shoppingListItem.setAttribute('id','sli'+list.uncheckedEntries[i].id);
    shoppingListItem.setAttribute('data-icon','troll-blank');
    shoppingListItem.setAttribute('data-corners',"false");
    shoppingListItem.setAttribute('data-shadow',"false");
    shoppingListItem.setAttribute('data-iconshadow',"true");
    shoppingListItem.setAttribute('data-wrapperels',"div");
    shoppingListItem.setAttribute('data-iconpos',"right");
    shoppingListItem.setAttribute('data-theme',"c");
    shoppingListItem.innerHTML = "<a>"+list.uncheckedEntries[i].name+"</a>";
            
    editListView.appendChild(editListItem);
    shoppingListView.appendChild(shoppingListItem);
  }
}

$(window).load(function(){
  /*list.addEntry("le cake");
  list.addEntry("it is a lie");
  list.addEntry("FLAUSCHFLAUSCH");
  list.addEntry("Flawwwwwwssssscchhzzz");*/
	//edit
	var editparent = document.getElementById('editcontent');
    editListView = document.createElement('ul');
    editListView.setAttribute('id','editListView');
    editListView.setAttribute('data-role','listview');
    editparent.appendChild(editListView);
    //populateListView(editlistview,'delete');
    
    //shopping
    var parent = document.getElementById('shoppingcontent');
    shoppingListView = document.createElement('ul');
    shoppingListView.setAttribute('id','shoppingListView');
    shoppingListView.setAttribute('data-role','listview');
    parent.appendChild(shoppingListView);
    //populateListView(listview,'troll-blank');
    
    initialiseListView();
    list.initialRequest();

    $('shoppingListView').listview();
    $('shoppingListView').listview('refresh');
	$('shoppingListView').trigger("create");
	$('editListView').listview();
    $('editListView').listview('refresh');
	$('editListView').trigger("create");
	$('#shopping').page();
	$('#edit').page();
	$('#shopping').trigger("create");
	$('#edit').trigger("create");


  $('#shoppingListView').on('click', 'li', function() {
    var uiId = $(this).attr('id');

    list.checkEntry(uiId.substr(3, uiId.length-3));
/*        $(this).parent().addClass("ui-icon-check"); 
        $(this).parent().removeClass("ui-icon-troll-blank");

		var id = $(this).attr('id');
        var change = '#'+id;
		var changeUI = change+" .ui-icon";
		
		var text = $(this).text();
            
        var x = "un";
    	if($(changeUI).hasClass("selected")) {
    		$(change).data('icon', 'troll-blank'); 
   			$(changeUI).addClass("ui-icon-troll-blank").removeClass("ui-icon-check"); 
   			$(changeUI).removeClass("selected");
   			var output = '<li data-icon="troll-blank" id="'+id+'"><a>'+text+'</a></li>';
   			x = "se";
    	} else {
   			$(change).data('icon', 'check'); 
   			$(changeUI).addClass("ui-icon-check").removeClass("ui-icon-troll-blank"); 
   			$(changeUI).addClass("selected");
   			var output = '<li data-icon="check" id="'+id+'"><a>'+text+'</a></li>';
   			x = "un";
    	}

    	$(this).slideUp(700).delay(100).queue(function() {
			$(this).remove();
			var change = '#'+id;
			var changeUI = change+" .ui-icon";
			if(x == "se") {
				$('#shoppingListView').prepend(output).listview('refresh');
    			$(change).data('icon', 'troll-blank'); 
   				$(changeUI).addClass("ui-icon-troll-blank").removeClass("ui-icon-check"); 
   				$(changeUI).removeClass("selected");
    		} else {
    			$('#shoppingListView').append(output).listview('refresh');
   				$(change).data('icon', 'check'); 
   				$(changeUI).addClass("ui-icon-check").removeClass("ui-icon-troll-blank"); 
   				$(changeUI).addClass("selected");
    		}
		});*/
    }); 

}); 

//login "validation"
$(function() {
    // Page show events
      $(document).bind("pagechange", function(event, obj) {
        //alert("lol");
    });
});

//login form
$(function() {  
  $(".button").click(function() {  
    // validate and process form here  
    var pname = $("input#name").val();  
    var pw = $("input#password").val();  
    $.post("../Login", { name: pname, password:pw },
    function(data) {
     	alert("Data Loaded: " + data);
   	});
    window.location = "#edit";
  });  
});  

//JSON test
$(function() {
  $(".jtest").click(function() {
        var test = new Array();
    test[0] = 123;
    test[1] = 456;
    test[2] = 789;
                
    var dataString = $.toJSON(test);
    //alert(data);
                                
    /*$.post("../TestServlet", { 'data': data },
    function(retdata) {
        alert("Data Loaded: " + retdata);
        });*/
/*      $.ajax({
                url: "test.php",
                type: "POST",
        data: {'data': jdata},   
        processData: false,
        contentType: 'application/json'
        }).done(function ( retdata ) { 
                alert("Data Loaded: " + retdata);});
        });*/
        var dataString = $.toJSON(test);
        $.post('../TestServlet', {data: dataString}, function(res){
        alert(res);});
  });
});
