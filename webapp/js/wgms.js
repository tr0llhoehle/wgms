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
      this.transmitUncheckedEntries();
    }
  },

  diffPoll: function() {
    //TODO: le magic
  },
  
  initialRequest: function() {
    //TODO le small magic
  },

  transmitDeletedEntries: function() {
    var successful;
    var tempDeletedEntries = this.deletedEntries;
    //TODO: Do the actual transmitting <-- ...
    //successful = confirm("Simulate transmission of created entries to the server.\nSuccess?");
    //... -->
    if(successful) {
      clearTimeout(this.deletedEntriesTimer);
      this.deleteEntriesTimer = 0;
      this.deletedEntries.splice(0, tempDeletedEntries.length);
    } else {
      this.deleteEntriesTimer = setTimeout(function(){list.transmitDeletedEntries()}, retryInterval);
    }
  },
  
  transmitAddedEntries: function() {
    var successful = false; //TODO: shouldn't be initialised with true. Just for testing...
    var tempAddedEntries = this.addedEntries;
    //TODO: Do the actual transmitting <-- ...
    //successful = confirm("Simulate transmission of created entries to the server.\nSuccess?");
    //... -->   
    var jdata = $.toJSON(tempAddedEntries);
    var dataString = $.toJSON(jdata);
    $.post('../AddEntries', {data: dataString}, function(res){
    	successful = true;});
    if(successful) {
      clearTimeout(this.addEntriesTimer);
      this.addEntriesTimer = 0;
      for(var i = 0; i < tempAddedEntries.length; ++i) {
        //TODO: DON'T use the id from tempAddedEntries but from the server's response!
        this.uncheckedEntries.push(new ListEntry(tempAddedEntries[i].id, tempAddedEntries[i].name));
      }
      this.addedEntries.splice(0, tempAddedEntries.length);
    } else {
      this.addEntriesTimer = setTimeout(function(){list.transmitAddedEntries()}, retryInterval);
    }
  },

  transmitCheckedEntries: function() {
    var successful = false;
    var tempCheckedEntries = this.uCheckedEntries;
    //TODO: Do the actual transmitting <-- ...
    //successful = confirm("Simulate transmission of newly checked entries to the server.\nSuccess?");
    //... -->
    var jdata = $.toJSON(tempCheckedEntries);
    var dataString = $.toJSON(jdata);
    $.post('../CheckEntries', {data: dataString}, function(res){
    	successful = true;});
    if(successful) {
      clearTimeout(this.checkEntriesTimer);
      this.checkEntriesTimer = 0;
      this.checkedEntries = this.checkedEntries.concat(tempCheckedEntries);
      this.uCheckedEntries.splice(0, tempCheckedEntries.length);
    } else {
      this.checkEntriesTimer = setTimeout(function(){list.transmitCheckedEntries()}, retryInterval);
    }
  },

  transmitUncheckedEntries: function() {
    var successful = false;
    var tempUncheckedEntries = this.uUncheckedEntries;
    //TODO: Do the actual transmitting <-- ...
    //successful = confirm("Simulate transmission of newly unchecked entries to the server.\nSuccess?");
    //... -->
    var jdata = $.toJSON(tempCheckedEntries);
    var dataString = $.toJSON(jdata);
    $.post('../UncheckEntries', {data: dataString}, function(res){
    	successful = true;});
    if(successful) {
      clearTimeout(this.uncheckEntriesTimer);
      this.uncheckEntriesTimer = 0;
      this.uncheckedEntries = this.uncheckedEntries.concat(tempUncheckedEntries);
      this.uUncheckedEntries.splice(0, tempUncheckedEntries.length);
    } else {
      this.uncheckEntriesTimer = setTimeout(function(){list.transmitUncheckedEntries()}, retryInterval);
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
    editListItem.setAttribute('id','li'+list.uncheckedEntries[i].id);
    editListItem.setAttribute('data-icon','delete');
    editListItem.setAttribute('data-corners',"false");
    editListItem.setAttribute('data-shadow',"false");
    editListItem.setAttribute('data-iconshadow',"true");
    editListItem.setAttribute('data-wrapperels',"div");
    editListItem.setAttribute('data-iconpos',"right");
    editListItem.setAttribute('data-theme',"c");
    editListItem.innerHTML = "<a>"+list.uncheckedEntries[i].name+"</a>";

    var shoppingListItem = document.createElement('li');
    shoppingListItem.setAttribute('id','li'+list.uncheckedEntries[i].id);
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
  list.addEntry("le cake");
  list.addEntry("it is a lie");
  list.addEntry("FLAUSCHFLAUSCH");
  list.addEntry("Flawwwwwwssssscchhzzz");
  list.initialRequest();
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
        $(this).parent().addClass("ui-icon-check"); 
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
		});
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
    $.post("../ShoppingListServlet", { name: pname, password:pw },
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
                
    var jdata = $.toJSON(test);
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
        var dataString = $.toJSON(jdata);
        $.post('../TestServlet', {data: dataString}, function(res){
        alert(res);});
  });
});
