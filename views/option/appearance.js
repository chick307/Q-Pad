var backgroundPage = chrome.extension.getBackgroundPage();
var pref = backgroundPage.pref;


var fontNameBox = Q('#font-name-box');
fontNameBox.value = pref.get('font-name', 'sans-serif');
fontNameBox.addEventListener('input', function(){
	var value = this.value.trim();
	pref.set('font-name', value);

	var msg = Q('#font-name-msg');
	onSaved(msg);
}, false);


var fontSizeBox = Q('#font-size-box');
fontSizeBox.value = pref.get('font-size', '14px');
fontSizeBox.addEventListener('input', function(){
	var value = this.value.trim();
	if(/^\d+$/.test(value))
		value += 'px';
	pref.set('font-size', value);

	var msg = Q('#font-size-msg');
	onSaved(msg);
}, false);


var popupSizeBox = Q('#popup-size-box');
popupSizeBox.value = pref.get('popup-size', '1');
popupSizeBox.addEventListener('change', function(){
	var value = this.value;
	pref.set('popup-size', String(value));

	var msg = Q('#popup-size-msg');
	onSaved(msg);
}, false);


var timeouts = {};
function onSaved(msg){
	if(msg.id in timeouts){
		clearTimeout(timeouts[msg.id]);
		msg.classList.remove('saved');
		timeouts[msg.id] = setTimeout(function(){
			setSaved();
		}, 100);
	}else{
		setSaved();
	}

	function setSaved(){
		msg.classList.add('saved');
		timeouts[msg.id] = setTimeout(function(){
			msg.classList.remove('saved');
			delete timeouts[msg.id];
		}, 1600);
	}
}


function Q(selector){
	return document.querySelector(selector);
}
