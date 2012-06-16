//An entry in the list contains the following attributes:
//  name - the name of the item
//  id - an unique identifier (unique in relation to the list) to generate 
//  valid html-ids.
//  selected - boolean value whether the entry is selected or not.
function ListEntry(id, isTempId, name, state) {
  this.name = name;
  this.id = id;
  this.isTempId = isTempId;
  this.state = state;
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
  nextId: 0,

  creationTimer: 0,

  deletionTimer: 0,

  addEntry: function(name) {
    this.entries.push(new ListEntry(this.nextId, name));
    this.nextId += 1;
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


function changeIcon(e) { 
	var change = "#"+e.id;
	var changeUI = change+" .ui-icon";
    if($(changeUI).hasClass("selected")) {
    	$(change).data('icon', 'troll-blank'); 
   		$(changeUI).addClass("ui-icon-troll-blank").removeClass("ui-icon-check"); 
   		$(changeUI).toggleClass("selected");
    } else {    	
   		$(change).data('icon', 'check'); 
   		$(changeUI).addClass("ui-icon-check").removeClass("ui-icon-troll-blank"); 
   		$(changeUI).toggleClass("selected");
    }
}
