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