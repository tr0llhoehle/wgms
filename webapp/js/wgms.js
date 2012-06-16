//definition of an anonymous class which acts as a list fo ListEntries.
//An entry in the list contains the following attributes:
//  name - the name of the item
//  id - an unique identifier (unique in relation to the list) to generate valid html-ids.
//  selected - boolean value whether the entry is selected or not.
var list = {
  listEntries: [],
  //TODO: this may cause overflows when the app runs a long time, I suppose...
  nextId: 0,

  addEntry: function(name) {
    var entry;
    entry.name = name;
    entry.id = this.nextId;
    this.nextId += 1;
    entry.selected = false;
    return this.listEntries.push(entry);
  },

  removeEntry: function(foo) {
    for(var i = 0; i < listEntries.length; ++i) {
      if(foo == entry.id) {
        listEntries.splice(i, 1);
        break;
      }
    }
  }
}

$(window).load(function(){

  $('#listview').on('click', 'li', function() {
        //alert("Works"); // id of clicked li by directly accessing DOMElement property
        $(this).parent().addClass("ui-icon-check"); 
        $(this).parent().removeClass("ui-icon-troll-blank");
        //$(this).remove (); 

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
				//alert("selected");
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
