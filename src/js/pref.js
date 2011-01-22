// Preference Class

function Preference(args){
	var prefix = args.prefix || '';
	var suffix = args.suffix || '';
	var storage = args.storage || localStorage;
	var cache = {};
	
	this.get = function(key, defaultValue){
		key = prefix + key + suffix;
		var result;
		if(key in cache){
			result = cache[key];
		}else{
			var jsonString = storage[key];
			if(jsonString)
				result = JSON.parse(jsonString);
		}
		if(typeof result === 'undefined')
			result = defaultValue;
		return result;
	};
	
	this.set = function(key, value){
		key = prefix + key + suffix;
		storage[key] = JSON.stringify(cache[key] = value);
		return value;
	};
	
	this.setDefault = function(key, value){
		var result = this.get(key);
		if(typeof result === 'undefined')
			result = this.set(key, value);
		return result;
	}
}
