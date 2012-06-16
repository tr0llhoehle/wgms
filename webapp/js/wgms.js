function ListEntry(id, name) {
  this.name = name;
  this.id = id;
  this.selected = false;
}

//definition of an anonymous class which acts as a list fo ListEntries.
//An entry in the list contains the following attributes:
//  name - the name of the item
//  id - an unique identifier (unique in relation to the list) to generate valid html-ids.
//  selected - boolean value whether the entry is selected or not.
var list = {
  entries: [],
  //TODO: this may cause overflows when the app runs a long time, I suppose...
  nextId: 0,

  addEntry: function(name) {
    this.entries.push(new ListEntry(this.nextId, name));
    this.nextId += 1;
  },

  removeEntry: function(id) {
    for(var i = 0; i < this.entries.length; ++i) {
      if(id == this.entries[i].id) {
        this.entries.splice(i, 1);
        break;
      }
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
