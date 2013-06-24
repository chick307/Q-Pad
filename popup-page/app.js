/*
 * (C) 2013 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

void function() {
	var app = angular.module('popupPage', ['qPad']);

	app.controller('PopupPageController', function(
		$scope,
		$timeout,
		reflect,
		share,
		tabs
	) {
		reflect($scope, 'text');
		reflect($scope, 'popup-size');
		reflect($scope, 'font-name');
		reflect($scope, 'font-size');

		$scope.selectionStart = $scope.selectionEnd = 0;
		$scope.insert = function(string) {
			var text = $scope.text;
			$scope.text = text.substring(0, $scope.selectionStart) + string +
				text.substring($scope.selectionEnd);
			$scope.selectionStart = $scope.selectionEnd =
				$scope.selectionStart + string.length;
		};

		$scope.state = '';
		$scope.$watch('state', function(state) {
			$timeout(function() {
				if (state !== '' && $scope.focus)
					$scope.focus = false;
			});
		});

		$scope.focus = true;
		$scope.$watch('focus', function(value) {
			$timeout(function() {
				if (!value && $scope.state === '')
					$scope.focus = true;
			});
		});

		$scope.changeState = function(state, id) {
			$scope.state = state;
			$scope.focus = (state === '');

			var node = (id != null) ? document.getElementById(id) : null;
			$timeout(function() {
				if (node)
					node.focus();
			}, 10);
		};

		$scope.shareViaGmail = function() {
			share.viaGmail($scope.text).then(function() {
				if (!$scope.maximized)
					window.close();
				$scope.changeState('');
			});
		};

		$scope.shareViaBlogger = function() {
			share.viaBlogger($scope.text).then(function() {
				if (!$scope.maximized)
					window.close();
				$scope.changeState('');
			});
		};

		$scope.shareViaTwitter = function() {
			share.viaTwitter($scope.text).then(function() {
				if (!$scope.maximized)
					window.close();
				$scope.changeState('');
			});
		};

		$scope.clearText = function() {
			$scope.text = '';
			$scope.changeState('')
		};

		$scope.pasteUrl = function() {
			tabs.getActive().then(function(tab) {
				$scope.insert(tab.url);
				$timeout(function() {
					$scope.changeState('');
				});
			});
		};

		$scope.pasteTitle = function() {
			tabs.getActive().then(function(tab) {
				$scope.insert(tab.title);
				$timeout(function() {
					$scope.changeState('');
				});
			});
		};

		$scope.pasteSelection = function() {
			tabs.getActive().then(function(tab) {
				chrome.tabs.executeScript(tab.id, {
					code: 'String(getSelection())'
				}, function(results) {
					$scope.insert(results[0]);
					$timeout(function() {
						$scope.changeState('');
					});
				});
			});
		};

		$scope.maximized = location.hash === '#m';

		$scope.maximize = function() {
			var url = chrome.runtime.getURL('/popup-page/index.html#m');
			tabs.create(url).then(function() {
				window.close();
			});
		};

		$scope.openOptionsPage = function() {
			var url = chrome.runtime.getURL('/options-page/index.html');
			tabs.create(url).then(function() {
				if (!$scope.maximized)
					window.close();
			});
		};

		$scope.close = function() {
			window.close();
		};
	});

	app.directive('textFrame', function($timeout, $parse) {
		return {
			restrict: 'A',
			scope: {
				'fontName': '=',
				'fontSize': '=',
				'text': '=',
				'focus': '=',
				'selectionStart': '=',
				'selectionEnd': '='
			},
			link: function(scope, element, attrs) {
				var iframe = document.createElement('iframe');
				iframe.src = './textarea.html';
				element.append(iframe);

				iframe.onload = angular.bind(scope, scope.$apply, function() {
					var doc = iframe.contentDocument;
					var textarea = doc.querySelector('textarea');

					scope.$watch('fontName', function(value) {
						textarea.style.fontFamily = value;
					});

					scope.$watch('fontSize', function(value) {
						textarea.style.fontSize = value + 'px';
					});

					textarea.addEventListener('input', function() {
						scope.text = textarea.value;
						$timeout(function() {
							scope.selectionStart = textarea.selectionStart;
							scope.selectionEnd = textarea.selectionEnd;
						});
					});

					scope.$watch('text', function(value) {
						textarea.value = value;
						$timeout(function() {
							textarea.selectionStart = scope.selectionStart;
							textarea.selectionEnd = scope.selectionEnd;
						});
					});

					textarea.addEventListener('focus', function() {
						scope.focus = true;
					}, false);

					textarea.addEventListener('blur', function() {
						scope.focus = false;
					}, false);

					scope.$watch('focus', function(value) {
						if (value)
							textarea.focus();
					});

					angular.element(textarea).bind([
						'click',
						'keydown'
					].join(' '), function() {
						$timeout(function() {
							scope.selectionStart = textarea.selectionStart;
							scope.selectionEnd = textarea.selectionEnd;
						});
					});

					scope.$watch('selectionStart', function(value) {
						if (textarea.selectionStart !== value)
							textarea.selectionStart = scope.selectionEnd;
					});

					scope.$watch('selectionEnd', function(value) {
						if (textarea.selectionEnd !== value)
							textarea.selectionEnd = value;
					});

					var keyBindable = $parse(attrs.keyBindable);
					var keyBind = $parse(attrs.keyBind);

					textarea.addEventListener('keydown', function(event) {
						if (!keyBindable(scope.$parent))
							return;

						var keys = [];
						if (event.metaKey) keys.push('Meta');
						if (event.ctrlKey) keys.push('Ctrl');
						if (event.altKey) keys.push('Alt');
						if (event.shiftKey) keys.push('Shift');
						keys.push({
							'9': 'Tab',
							'13': 'Enter',
							'32': 'Space',
							'191': '/'
						}[event.keyCode] || String.fromCharCode(event.keyCode));

						var key = keys.join('+');
						var binding = keyBind(scope.$parent)[key];
						if (binding) {
							event.preventDefault();
							$parse(binding)(scope.$parent);
						}
					});
				});
			}
		};
	});

	app.directive('whenFocus', function() {
		return {
			restrict: 'A',
			scope: {
				whenFocus: '&'
			},
			link: function(scope, element, attrs) {
				element.bind('focus', function() {
					scope.whenFocus({});
				});
			}
		};
	});

	app.directive('esc', function($parse) {
		return {
			restrict: 'A',
			scope: false,
			link: function(scope, element, attrs) {
				element.bind('keydown', function(event) {
					if (event.keyCode !== 27)
						return;

					$parse(attrs.esc)(scope, {
						$event: event
					});

					event.preventDefault();
					event.stopPropagation();
				});
			}
		};
	});

	app.directive('nav', function() {
		return {
			restrict: 'A',
			scope: false,
			link: function(scope, element, attrs) {
				element.bind('keydown', function(event) {
					var key =
						(event.keyCode === 9) ?
						!event.shiftKey ? 'next' : 'prev' :
						(event.keyCode === 37) ? 'left' :
						(event.keyCode === 38) ? 'up' :
						(event.keyCode === 39) ? 'right' :
						(event.keyCode === 40) ? 'down' : null;

					if (key === null)
						return;

					event.preventDefault();
					event.stopPropagation();

					if (attrs[key] != null) {
						var node = document.getElementById(attrs[key]);
						if (node)
							node.focus();
					}
				});
			}
		};
	});
}();
