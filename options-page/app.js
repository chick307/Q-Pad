/*
 * (C) 2013 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

void function() {
	var app = angular.module('optionsPage', ['qPad']);

	app.controller('OptionsPageController', function($scope, reflect) {
		reflect($scope, 'font-name');
		reflect($scope, 'font-size');
		reflect($scope, 'popup-size');
	});

	app.directive('savedMsg', function(getPreference) {
		var pref = getPreference();

		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var key = attrs.savedMsg;
				var debounce = null;
				var timeoutId = null;

				pref.on('change', function(event) {
					if (event.key === key) {
						if (debounce)
							clearTimeout(debounce);
						element.css('opacity', '0');
						debounce = setTimeout(function() {
							debounce = null;
							if (timeoutId !== null)
								clearTimeout(timeoutId);
							element.css('opacity', '1');
							timeoutId = setTimeout(function() {
								timeoutId = null;
								element.css('opacity', '0');
							}, 300 + 1000);
						}, 500);
					}
				});
			}
		};
	});

	app.directive('externalLink', function(tabs) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind('click', function(event) {
					event.preventDefault();
					tabs.create(attrs.href);
				});
			}
		};
	});
}();
