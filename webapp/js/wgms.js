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

  diffPoll: function() {
    //TODO: le magic
  },
  
  transmitDeletedEntries: function(entries) {
    var successful;
    var tempDeletedEntries = this.deletedEntries;
    //TODO: Do the actual transmitting <-- ...
    successful = confirm("Simulate transmission of created entries to the server.\nSuccess?");
    //... -->
    if(successful) {
      clearTimeout(deletedEntriesTimer);
      deleteEntriesTimer = 0;
      this.deletedEntries.splice(0, tempDeletedEntries.length);
    } else {
      deleteEntriesTimer = setTimeout(function(){list.transmitDeletedEntries()}, retryInterval);
    }
  },
  
  transmitAddedEntries: function() {
    var successful;
    var tempAddedEntries = this.addedEntries;
    //TODO: Do the actual transmitting <-- ...
    successful = confirm("Simulate transmission of created entries to the server.\nSuccess?");
    //... -->
    if(successful) {
      clearTimeout(addEntriesTimer);
      addEntriesTimer = 0;
      for(var i = 0; i < tempAddedEntries.length; ++i) {
        //TODO: DON'T use the id from tempAddedEntries but from the server's response!
        this.uncheckedEntries.push(new ListEntry(tempAddedEntries[i].id, tempAddedEntries[i].name));
      }
      this.addedEntries.splice(0, tempAddedEntries.length);
    } else {
      addEntriesTimer = setTimeout(function(){list.transmitAddedEntries()}, retryInterval);
    }
  },

  transmitCheckedEntries: function() {
    var successful;
    var tempCheckedEntries = this.uCheckedEntries;
    //TODO: Do the actual transmitting <-- ...
    successful = confirm("Simulate transmission of newly checked entries to the server.\nSuccess?");
    //... -->
    if(successful) {
      clearTimeout(checkEntriesTimer);
      checkEntriesTimer = 0;
      this.checkedEntries.concat(tempCheckedEntries);
      this.uCheckedEntries.splice(0, tempCheckedEntries.length);
    } else {
      checkEntriesTimer = setTimeout(function(){transmitCheckedEntries()}, retryInterval);
    }
  },

  transmitUncheckedEntries: function() {
    var successful;
    var tempUncheckedEntries = this.uUncheckedEntries;
    //TODO: Do the actual transmitting <-- ...
    successful = confirm("Simulate transmission of newly unchecked entries to the server.\nSuccess?");
    //... -->
    if(successful) {
      clearTimeout(uncheckEntriesTimer);
      uncheckEntriesTimer = 0;
      this.uncheckedEntries.concat(tempUncheckedEntries);
      this.uUncheckedEntries.splice(0, tempUncheckedEntries.length);
    } else {
      uncheckEntriesTimer = setTimeout(function(){transmitUncheckedEntries()}, retryInterval);
    }
  },
}

function populateListView(listview,icon) {
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
	}
	//$("#shopping").trigger("create");
}

$(window).load(function(){
	list.addEntry("HATERS");
	list.addEntry("GONNA");
	list.addEntry("HATE");
	//edit
	var editparent = document.getElementById('editcontent');
    var editlistview = document.createElement('ul');
    editlistview.setAttribute('id','editlistview');
    editlistview.setAttribute('data-role','listview');
    editparent.appendChild(editlistview);
    populateListView(editlistview,'delete');
    
    //shopping
    var parent = document.getElementById('shoppingcontent');
    var listview = document.createElement('ul');
    listview.setAttribute('id','listview');
    listview.setAttribute('data-role','listview');
    parent.appendChild(listview);
    populateListView(listview,'troll-blank');
    
    $('listview').listview();
    $('listview').listview('refresh');
	$('listview').trigger("create");
	$('editlistview').listview();
    $('editlistview').listview('refresh');
	$('editlistview').trigger("create");
	$("#shopping").page();
	$("#edit").page();
	$("#shopping").trigger("create");
	$("#edit").trigger("create");


  $('#listview').on('click', 'li', function() {
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
				$('#listview').prepend(output).listview('refresh');
    			$(change).data('icon', 'troll-blank'); 
   				$(changeUI).addClass("ui-icon-troll-blank").removeClass("ui-icon-check"); 
   				$(changeUI).removeClass("selected");
    		} else {
    			$('#listview').append(output).listview('refresh');
   				$(change).data('icon', 'check'); 
   				$(changeUI).addClass("ui-icon-check").removeClass("ui-icon-troll-blank"); 
   				$(changeUI).addClass("selected");
    		}
		});
    }); 

}); 
