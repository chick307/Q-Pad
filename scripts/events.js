/*
 * (C) 2013 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

void function(global, definition) {
	if (typeof define === 'function' && define.amd) {
		// RequireJS
		define('events', ['exports'], definition);
	} else {
		definition(global.events = {});
	}
}(this, function(exports) {
	var Event = exports.Event = (function() {
		var ctor = function Event(type, target) {
			if (!(this instanceof ctor)) {
				throw new TypeError(
					'Constructor cannot be called as a function.');
			}

			this.type = type;
			this.target = target;
		};

		return ctor;
	}());


	var EventEmitter = exports.EventEmitter = (function() {
		var ctor = function EventEmitter() {
			if (!(this instanceof ctor)) {
				throw new TypeError(
					'Constructor cannot be called as a function.');
			}

			this._listeners = Object.create(null);
			this._onceListeners = Object.create(null);
		};

		var proto = ctor.prototype;

		proto.on = function on(type, listener) {
			var listeners = (type in this._listeners) ? this._listeners[type] :
				(this._listeners[type] = []);
			listeners.push(listener);
		};

		proto.once = function once(type, listener) {
			var listeners = this._onceListeners[type] ||
				(this._onceListeners[type] = [])
			listeners.push(listener);
		};

		proto.removeListener = function removeListener(type, listener) {
			var listeners = this._listeners[type];
			var index = !listeners ? -1 : listeners.indexOf(listener);
			if (index !== -1)
				listeners.splice(index, 1);
		};

		proto.removeOnceListener =
			function removeOnceListener(type, listener) {
			var listeners = this._onceListeners[type];
			var index = !listeners ? -1 : listeners.indexOf(listener);
			if (index !== -1)
				listeners.splice(index, 1);
		};

		proto.hasListener = function hasListener(type, listener) {
			var listeners = this._listeners[type];
			if (arguments.length === 1)
				return !!listeners[type];
			return !listeners ? false : (listeners.indexOf(listener) !== -1);
		};

		proto.hasOnceListener = function hasOnceListener(type, listener) {
			var listeners = this._onceListeners[type];
			if (arguments.length === 1)
				return !!listeners[type];
			return !listeners ? false : (listeners.indexOf(listener) !== -1);
		};

		proto.emit = function emit(event) {
			var type = event.type, listeners, length, i;

			listeners = this._onceListeners[type];
			if (listeners) {
				delete this._onceListeners[type];
				length = listeners.length;
				for (i = 0; i < length; i++)
					listeners[i].call(this, event);
			}

			listeners = this._listeners[type];
			if (listeners) {
				length = listeners.length;
				for (i = 0; i < length; i++)
					listeners[i].call(this, event);
			}
		};

		return ctor;
	}());
});
