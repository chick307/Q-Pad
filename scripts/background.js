/*
 * (C) 2013 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

angular.injector(['qPad']).invoke(function(getPreference, tabs) {
	var pref = getPreference();

	pref.add('text', '');
	pref.add('font-name', 'sans-serif');
	pref.add('font-size', 14);
	pref.add('popup-size', '1');

	// migration
	if (typeof pref.get('font-size') === 'string')
		pref.set('font-size', parseInt(pref.get('font-size'), 10) | 0 || 14);

	setPopup(pref.get('popup-size'));

	pref.on('change', function(event) {
		if (event.key === 'popup-size')
			setPopup(event.value);
	});

	function setPopup(size) {
		chrome.browserAction.setPopup({
			popup: (size === '2') ? '' : '/popup-page/index.html'
		});
	}

	chrome.browserAction.onClicked.addListener(function(tab) {
		tabs.create('/popup-page/index.html#m');
	});
});
