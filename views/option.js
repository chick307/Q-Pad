['appearance', 'about'].forEach(function(id){
	Q('#' + id).addEventListener('click', function(){
		Q('header').className = id;
	}, false);
});

function Q(selector){
	return document.querySelector(selector);
}
