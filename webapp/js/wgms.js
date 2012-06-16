//definition of an anonymous class which acts as a list fo ListEntries.
//An entry in the list contains the following attributes:
//  name - the name of the item
//  id - an unique identifier (unique in relation to the list) to generate valid html-ids.
//  selected - boolean value whether the entry is selected or not.
var list = {
  listEntries: [],
  nextId: 0,

  addEntry: function(name) {
    var entry;
    entry.name = name;
    entry.id = this.nextId;
    this.nextId += 1;
    entry.selected = false;
    return this.listEntries.push(entry);
  }

  removeEntry: function(id) {
    for(var i = 0; i < listEntries.length; ++i) {
      if(id == entry.id) {
        listEntries.splice(i, 1);
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
