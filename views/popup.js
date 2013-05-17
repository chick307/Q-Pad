var backgroundPage = chrome.extension.getBackgroundPage();
var pref = backgroundPage.pref;

var popupSize = pref.get('popup-size', '1');
if(!location.hash){
	switch(popupSize){
		case '0':
			Q('html').classList.add('small');
			break;
		case '2':
			open(chrome.extension.getURL('views/popup.html') + '#m');
			close();
	}
}

window.addEventListener('load', function(){
	var frame = Q('iframe');
	var textarea = frame.contentWindow;
	textarea.focus();


	document.addEventListener('click', function(){
		textarea.focus();
	}, false);


	Q('#black').addEventListener('click', function(e){
		e.preventDefault();
		e.stopPropagation();
	}, false);

	Q('#black').addEventListener('keydown', function(e){
		if(e.keyIdentifier === 'U+001B'){
			if(Q('#share-dialog.visible')){
				click('#share-cancel');
			}else if(Q('#clear-dialog.visible')){
				click('#clear-cancel');
			}else if(Q('#paste-dialog.visible')){
				click('#paste-cancel');
			}else if(Q('#help-dialog.visible')){
				click('#help-close');
			}
		}
	}, false);


	Q('#share-button').addEventListener('click', function(){
		Q('#black').classList.add('visible');
		Q('#share-dialog').classList.add('visible');
		Q('#share-dialog button').focus();
	}, false);

	Q('#share-cancel').addEventListener('click', function(){
		textarea.focus();
		Q('#share-dialog').classList.remove('visible');
		Q('#black').classList.remove('visible');
	}, false);

	Q('#share-cancel').addEventListener('keydown', function(event){
		if(event.keyIdentifier === 'Up'){
			Q('#share-dialog li:nth-last-child(2) > button').focus();
			event.preventDefault();
		}
	}, false);


	Q('#clear-button').addEventListener('click', function(){
		Q('#black').classList.add('visible');
		Q('#clear-dialog').classList.add('visible');
		Q('#clear-cancel').focus();
	}, false);

	Q('#clear-cancel').addEventListener('click', function(){
		textarea.focus();
		Q('#clear-dialog').classList.remove('visible');
		Q('#black').classList.remove('visible');
	}, false);

	Q('#clear-cancel').addEventListener('keydown', function(event){
		if(event.keyIdentifier === 'Right'){
			Q('#clear-ok').focus();
			event.preventDefault();
		}
	}, false);

	Q('#clear-ok').addEventListener('click', function(){
		textarea.clear();
		textarea.save();
		textarea.focus();
		Q('#clear-dialog').classList.remove('visible');
		Q('#black').classList.remove('visible');
	}, false);

	Q('#clear-ok').addEventListener('keydown', function(event){
		if(event.keyIdentifier === 'Left'){
			Q('#clear-cancel').focus();
			event.preventDefault();
		}
	}, false);


	Q('#paste-button').addEventListener('click', function(){
		Q('#black').classList.add('visible');
		Q('#paste-dialog').classList.add('visible');
	}, false);

	Q('#paste-url').addEventListener('click', function(){
		chrome.tabs.getSelected(null, function(tab){
			textarea.insert(tab.url);
		});
		textarea.focus();
		Q('#paste-dialog').classList.remove('visible');
		Q('#black').classList.remove('visible');
	}, false);

	Q('#paste-title').addEventListener('click', function(){
		chrome.tabs.getSelected(null, function(tab){
			textarea.insert(tab.title || '');
		});
		textarea.focus();
		Q('#paste-dialog').classList.remove('visible');
		Q('#black').classList.remove('visible');
	}, false);

	Q('#paste-selection').addEventListener('click', function(){
		chrome.tabs.getSelected(null, function(tab){
			chrome.tabs.sendRequest(tab.id, {
				method: 'GetSelection',
				params: []
			}, function(selection){
				textarea.insert(selection);
			});
		});
		textarea.focus();
		Q('#paste-dialog').classList.remove('visible');
		Q('#black').classList.remove('visible');
	}, false);

	Q('#paste-cancel').addEventListener('click', function(){
		textarea.focus();
		Q('#paste-dialog').classList.remove('visible');
		Q('#black').classList.remove('visible');
	}, false);


	Q('#help-close').addEventListener('click', function(){
		textarea.focus();
		Q('#help-dialog').classList.remove('visible');
		Q('#black').classList.remove('visible');
	}, false);


	Q('#maximize-button').addEventListener('click', function(){
		window.open(
			chrome.extension.getURL('/views/popup.html') + '#m');
		close();
	}, false);

	Q('#option-button').addEventListener('click', function(){
		window.open(chrome.extension.getURL('/views/option.html'));
		if(!Q('html:target'))
			close();
	}, false);

	Q('#close-button').addEventListener('click', function(){
		close();
	}, false);

	var fragment = document.createDocumentFragment();
	backgroundPage.externalServices.forEach(function(service){
		var item = document.createElement('li');
		item.style.fontSize = '16px';
		var button = document.createElement('button');
		var image = document.createElement('img');
		image.src = service.icon;
		var name = document.createElement('span');
		name.textContent = service.name;
		button.appendChild(image);
		button.appendChild(name);
		item.appendChild(button);
		fragment.appendChild(item);

		button.addEventListener('click', function(){
			service.callback(pref.get('text', ''));
			if(!Q('html:target'))
				close();
		}, false);

		button.addEventListener('keydown', function(event){
			var sibling;

			if(event.keyIdentifier === 'Up'){
				sibling = item.previousElementSibling;
			}else if(event.keyIdentifier === 'Down'){
				sibling = item.nextElementSibling;
			}

			if(sibling)
				sibling.querySelector('button').focus();
		}, false);
	});
	var shareList = Q('#share-dialog > ul');
	shareList.insertBefore(fragment, shareList.firstElementChild);
});

window.showHelp = function(){
	Q('#black').classList.add('visible');
	Q('#help-dialog').classList.add('visible');
	Q('#help-dialog button').focus();
};

function Q(selector){
	return document.querySelector(selector);
}

function click(selector){
	var event = document.createEvent('Event');
	event.initEvent('click', false, false);
	Q(selector).dispatchEvent(event);
}
