var backgroundPage = chrome.extension.getBackgroundPage();
var pref = backgroundPage.pref;

var textarea = document.querySelector('textarea');
textarea.style.fontFamily = pref.get('font-name', 'sans-serif');
textarea.style.fontSize = pref.get('font-size', '14px');

textarea.value = pref.get('text', '');
textarea.setSelectionRange(pref.get('start', 0) + 1, pref.get('end', 0));
textarea.scrollTop = pref.get('top', 0);

textarea.addEventListener('input', save, false);
textarea.addEventListener('click', save, false);
textarea.addEventListener('contextmenu', save, false);
textarea.addEventListener('scroll', save, false);


document.addEventListener('keydown', function(event){
	var key = event.keyIdentifier, c = event.ctrlKey || event.metaKey;

	switch(key){
		case 'U+0009':
			insert('\t');
			break;
		case Key('/'):
		case Key('?'):
			if(c){
				top.showHelp();
				break;
			}
		case Key('L'):
			if(c){
				top.click('#clear-button');
				break;
			}
		case Key('P'):
			if(c){
				top.click('#paste-selection');
				break;
			}
		case Key('S'):
			if(c){
				top.click('#share-button');
				break;
			}
		case Key('T'):
			if(c){
				top.click('#paste-title');
				break;
			}
		case Key('U'):
			if(c){
				top.click('#paste-url');
				break;
			}
		case Key('W'):
			if(c){
				top.close();
				break;
			}
		default:
			return;
	}

	event.preventDefault();

	function Key(char){
		var u = char.toUpperCase().charCodeAt(0).toString(16);
		return 'U+0000'.slice(0, 6 - u.length) + u.toUpperCase();
	}
}, false);


function save(){
	pref.set('text', textarea.value);
	pref.set('start', textarea.selectionStart);
	pref.set('end', textarea.selectionEnd);
	pref.set('top', textarea.scrollTop);
}

function focus(){
	textarea.focus();
}

function isEmpty(){
	return textarea.value === '';
}

function clear(){
	textarea.value = '';
}

function insert(text){
	var value = textarea.value;
	var start = textarea.selectionStart;
	var end = textarea.selectionEnd;

	textarea.value = value.slice(0, start) + text +
		value.slice(end, value.length);

	textarea.selectionStart = textarea.selectionEnd =
		start + text.length;

	save();
}
