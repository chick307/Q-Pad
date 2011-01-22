
var methods = {};

methods.GetSelection = function(callback){
	callback(window.getSelection() + "");
};

chrome.extension.onRequest.addListener(function(r, s, c){
	var method = r.method;
	var params = r.params || [];
	var valueReturned = false;
	var func, result;
	
	params.push(function(){
		if(!valueReturned){
			c.apply(null, arguments);
			valueReturned = true;
		}
	});
	
	if(func = methods[method]){
		result = func.apply(null, params);
		if(!valueReturned && typeof result !== 'undefined')
			c.call(null, result);
	}
});
