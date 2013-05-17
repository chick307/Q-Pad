var pref = new Preference({
	prefix: 'pref-'
});


var externalServices = [];

externalServices.push({
	id: 1,
	name: 'Mail This (Gmail)',
	icon: chrome.extension.getURL('icons/gmail.png'),
	callback: function(text){
		var url = 'https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=' +
			'&body=' + encodeURIComponent(text);
		chrome.tabs.create({url: url, selected: true});
	}
});

externalServices.push({
	id: 2,
	name: 'Tweet This (Twitter)',
	icon: chrome.extension.getURL('icons/twitter.png'),
	callback: function(text){
		var url = 'http://twitter.com/?status=' +
			encodeURIComponent(text);
		chrome.tabs.create({url: url, selected: true});
	}
});

externalServices.push({
	id: 3,
	name: 'Blog This (Blogger)',
	icon: chrome.extension.getURL('icons/blogger.png'),
	callback: function(text){
		var url = 'http://www.blogger.com/blog-this.g?t=' +
			encodeURIComponent(text);
		chrome.tabs.create({url: url, selected: true});
	}
});
