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
  //contains all ListEntries the webapp knows.
  entries: [],
  //contains all newly created ListEntries which weren't successfully 
  //transmitted to the server.
  untransmittedCreatedEntries: [],
  //contains all deleted ListEntries which weren't successfully transmitted
  //to the server.
  untransmittedDeletedEntries: [],
  //TODO: this may cause overflows when the app runs a long time, I suppose...
  nextId: -1,

  creationTimer: 0,

  deletionTimer: 0,

  addEntry: function(name) {
    this.entries.push(new ListEntry(this.nextId, name));
    this.nextId -= 1;
    if(this.creationTimer == 0) {
      this.creationTimer = setInterval(function(){list.transmitCreatedEntries(this.untransmittedCreatedEntries)}, 5000);
    }
  },

  removeEntry: function(id) {
    for(var i = 0; i < this.entries.length; ++i) {
      if(id == this.entries[i].id) {
        this.entries.splice(i, 1);
        if(this.deletionTimer == 0) {
          this.deletionTimer = setInterval(function(){list.transmitDeletedEntries(this.untransmittedDeletedEntries)}, 5000);
        }
        break;
      }
    }
  },

  //Used to transmit creation entries. 
  transmitCreatedEntries: function(entries) {
    var successful;
    successful = confirm("Simulate transmission of created entries to the server.\nSuccess?");
    //TODO: Do the actual transmitting...
    if(successful) {
      clearTimeout(this.creationTimer);
      //looks quadratic but should normally be linear since entries and this.untr[...]Entries are identical most of the time.
      for(var entry in entries) {
        for(var i = 0; i < this.untransmittedCreatedEntries.length; ++i) {
          if(entry.id == this.untransmittedCreatedEntries[i].id) {
            this.untransmittedCreatedEntries.splice(i, 1);
            break;
          }
        }
      }
      this.creationTimer = 0;
    }
  },

  //Used to transmit the deletion of entries.
  transmitDeletedEntries: function(entries) {
    var successful;
    var temp = "Simulate transmission of deleted entries to the server.\n";
    successful = confirm("Simulate transmission of deleted entries to the server.\nSuccess?");
    //TODO: Do the actual transmitting...
    if(successful) {
      clearTimeout(this.deletionTimer);
      //looks quadratic but should normally be linear since entries and this.untr[...]Entries are identical most of the time.
      for(var entry in entries) {
        for(var i = 0; i < this.untransmittedDeletedEntries.length; ++i) {
          if(entry.id == this.untransmittedDeletedEntries[i].id) {
            this.untransmittedDeletedEntries.splice(i, 1);
            break;
          }
        }
      }
      this.deletionTimer = 0;
    }
  }
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
