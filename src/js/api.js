/* for Google Chrome Extension */

(function(){
	var back = chrome.extension.getBackgroundPage();

	if(back === window){
		chrome.extension.onRequest.addListener(function(r, s, c){
			var method = r.method;
			var params = r.params || [];
			var valueReturned = false;
			var func, result;
			
			params.push(function(){
				if(valueReturned)
					return;
				c.apply(null, arguments);
				valueReturned = true;
			});
			
			if(func = window.methods[method]){
				result = func.apply(null, params);
				if(!valueReturned && typeof result !== 'undefined')
					c.call(null, result);
			}
		});
	}else{
		window.api = {};
		
		var createApi = function(method){
			return function(){
				var args = Array.prototype.slice.call(arguments);
				var l = args.length;
				var callback;
				
				if(l > 0 && typeof args[l - 1] === 'function')
					callback = args.pop();
				else
					callback = function(){};
				
				chrome.extension.sendRequest(
					{method: method, params: args}, callback);
			};
		};
		
		for(var method in back.methods){
			if(back.methods.hasOwnProperty(method))
				window.api[method] = createApi(method);
		}
	}
})();
