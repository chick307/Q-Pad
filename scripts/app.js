/*
 * (C) 2013 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

void function() {
	var app = angular.module('qPad', ['ng']);

	app.factory('share', function(tabs) {
		return {
			viaGmail: function(text) {
				var url = 'https://mail.google.com/mail/?view=cm&fs=1&tf=1' +
					'&su=&body=' + encodeURIComponent(text);
				return tabs.create(url);
			},
			viaBlogger: function(text) {
				var url = 'http://www.blogger.com/blog-this.g?t=' +
					encodeURIComponent(text);
				return tabs.create(url);
			},
			viaTwitter: function(text) {
				var url = 'https://twitter.com/intent/tweet?text=' +
					encodeURIComponent(text);
				return tabs.create(url);
			}
		};
	});

	app.factory('reflect', function(getPreference) {
		var pref = getPreference();

		return function(scope, key) {
			var name = key.replace(/\-(.)/g, function(_, c) {
				return c.toUpperCase();
			});

			scope[name] = pref.get(key);

			scope.$watch(name, function(newValue) {
				var oldValue = pref.get(key);
				if (newValue !== oldValue)
					pref.set(key, newValue);
			});

			pref.on('change', function(event) {
				if (event.key === key && event.value !== scope[name]) {
					scope.$apply(function() {
						scope[name] = event.value;
					});
				}
			});
		};
	});

	app.factory('getPreference', function() {
		var pref = new wrappedStorage.WrappedStorage(localStorage, {
			prefix: 'pref-',
			encoder: JSON.stringify,
			decoder: JSON.parse
		});

		return function() {
			return pref;
		};
	});

	app.factory('tabs', function($rootScope, $q) {
		return {
			getActive: function getActive() {
				var deferred = $q.defer();

				chrome.tabs.query({
					active: true,
					currentWindow: true
				}, function(tabs) {
					$rootScope.$apply(function() {
						if (0 < tabs.length) {
							deferred.resolve(tabs[0]);
						} else {
							deferred.reject('No tabs exists.');
						}
					});
				});

				return deferred.promise;
			},
			getByUrl: function getByUrl(url) {
				var deferred = $q.defer();

				chrome.tabs.query({
					url: url
				}, function(tabs) {
					$rootScope.$apply(function() {
						if (0 < tabs.length) {
							deferred.resolve(tabs[0]);
						} else {
							deferred.reject('No tabs exists.');
						}
					});
				});

				return deferred.promise;
			},
			create: function create(url, active) {
				var deferred = $q.defer();

				chrome.tabs.create({
					url: url,
					active: active == null || !!active
				}, function(tab) {
					deferred.resolve(tab);
				});

				return deferred.promise;
			}
		};
	});
}();
