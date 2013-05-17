document.addEventListener('click', function(e){
	if(e.target.href){
		window.open(e.target.href);
		e.preventDefault();
	}
}, false);
