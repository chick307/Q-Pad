
var externalServices = [];

externalServices.push({
	id: 1,
	name: 'Mail This (Gmail)',
	icon: chrome.extension.getURL('icons/gmail.png'),
	callback: function(text){
		var url = 'https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=' +
			'&body=' + encodeURIComponent(text);
		methods.CreateTab(url, true);
	}
});

externalServices.push({
	id: 2,
	name: 'Tweet This (Twitter)',
	icon: chrome.extension.getURL('icons/twitter.png'),
	callback: function(text){
		var url = 'http://twitter.com/?status=' +
			encodeURIComponent(text);
		methods.CreateTab(url, true);
	}
});

externalServices.push({
	id: 3,
	name: 'Blog This (Blogger)',
	icon: chrome.extension.getURL('icons/blogger.png'),
	callback: function(text){
		var url = 'http://www.blogger.com/blog-this.g?t=' +
			encodeURIComponent(text);
		methods.CreateTab(url, true);
	}
});


var pref = Preference('pref', localStorage, {
	'text': localStorage['text'] || '',
	'start': 0,
	'end': 0,
	'top': 0,
	'updated': 2,
	'font-name': 'sans-serif',
	'font-size': '14px',
});


var methods = {};

methods.GetExternalServices = function(){
	var result = [];
	externalServices.forEach(function(service){
		result.push({
			id: service.id,
			name: service.name,
			icon: service.icon
		});
	});
	return result;
};

methods.ShareTextToExternalService = function(id){
	try{
		externalServices.forEach(function(service){
			if(service.id !== id)
				return;
			service.callback(pref.get('text'));
			throw 'StopIteration';
		});
	}catch(e){
		if(e != 'StopIteration')
			console.error(e);
	}
};

methods.GetText = function(){
	return {
		text: pref.get('text'),
		start: pref.get('start'),
		end: pref.get('end'),
		top: pref.get('top'),
		updated: pref.get('updated')
	};
};

methods.SetText = function(params){
	if(params.updated){
		if(params.updated < pref.get('updated', 0))
			return;
	}else{
		params.updated = new Date() * 1;
	}
	
	for(var key in params)
		pref.set(key, params[key]);
};

methods.SetPref = function(params, value){
	if(typeof value === 'undefined' || typeof value === 'function')
		pref.update(params);
	else
		pref.set(params, value);
};

methods.GetPref = function(callback){
	return {
		'font-name': pref.get('font-name'),
		'font-size': pref.get('font-size')
	};
};

methods.CreateTab = function(url, selected){
	if(typeof selected === 'undefined' || typeof selected === 'function')
		selected = true;
	chrome.tabs.create({url: url, selected: selected});
};

methods.GetSelectedTab = function(callback){
	chrome.tabs.getSelected(null, function(tab){
		callback(tab);
	});
};

methods.GetSelection = function(callback){
	methods.GetSelectedTab(function(tab){
		chrome.tabs.sendRequest(tab.id, {
			method: 'GetSelection',
			params: []
		}, callback);
	});
};
