
function Preference(storage_key, storage, items){
	var cache = JSON.parse(storage[storage_key] || '{}');
	var undef;
	
	var result = {
		get: function(key, defaultValue){
			var result = cache[key];
			if(result === undef)
				return defaultValue;
			return result;
		},
		getAll: function(){
			return cache;
		},
		set: function(key, value){
			var d = {};
			d[key] = value;
			this.update(d);
			return value;
		},
		setDefault: function(key, value){
			var result = cache[key];
			if(result === undef)
				return this.set(key, value);
			return result;
		},
		update: function(obj){
			for(var key in obj) if(obj.hasOwnProperty(key)){
				cache[key] = obj[key];
			}
			
			storage[storage_key] = JSON.stringify(cache);
		},
		updateDefault: function(obj){
			for(var key in obj){
				if(obj.hasOwnProperty(key) && cache[key] === undef)
					cache[key] = obj[key];
			}
			
			storage[storage_key] = JSON.stringify(cache);
		}
	};
	
	result.updateDefault(items);
	
	return result;
}
