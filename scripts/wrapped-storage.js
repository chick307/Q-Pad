/*
 * (C) 2013 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

void function(global, definition) {
	if (typeof define === 'function' && define.amd) {
		// RequireJS
		define('wrappedStorage', ['exports', 'events'], definition);
	} else {
		definition(global.wrappedStorage = {}, global.events);
	}
}(this, function(exports, events) {
	var WrappedStorage = exports.WrappedStorage = (function() {
		var superCtor = events.EventEmitter;
		var ctor = function WrappedStorage(storage, options) {
			if (!(this instanceof ctor)) {
				throw new TypeError(
					'Constructor cannot be called as a function.');
			}

			superCtor.call(this);

			if (options == null)
				options = {};

			this.storage = storage;
			this.prefix = String(options.prefix || '');
			this.suffix = String(options.suffix || '');
			this.encoder = (typeof options.encoder === 'function') ?
				options.encoder : function(value) { return value };
			this.decoder = (typeof options.decoder === 'function') ?
				options.decoder : function(value) { return value };

			if (typeof window !== 'undefined')
				window.addEventListener('storage', this, false);
		};

		var superProto = superCtor.prototype;
		var proto = ctor.prototype = Object.create(superProto);

		proto.get = function get(key, defaultValue) {
			key = String(key);

			var actualKey = [this.prefix, key, this.suffix].join('');
			if (Object.prototype.hasOwnProperty.call(this.storage, actualKey))
				return this.decoder(this.storage[actualKey]);
			return defaultValue;
		};

		proto.set = function set(key, value) {
			key = String(key);

			var actualKey = [this.prefix, key, this.suffix].join('');
			this.storage[actualKey] = this.encoder(value);
			this.onChange(key, value);
		};

		proto.add = function add(key, value) {
			var obj = {}, val = this.get(key, obj);
			if (val === obj)
				this.set(key, value);
		};

		proto.remove = function remove(key) {
			key = String(key);

			var actualKey = [this.prefix, key, this.suffix].join('');
			delete this.storage[actualKey];
		};

		proto.onChange = function onChange(key, value) {
			var event = new events.Event('change', this);
			event.key = key;
			event.value = value;
			this.emit(event);
		};

		proto.handleEvent = function handleEvent(domEvent) {
			if (domEvent.type !== 'storage' ||
				domEvent.storageArea !== this.storage)
				return;

			var key = domEvent.key;

			var index = key.indexOf(this.prefix);
			if (index !== 0)
				return;
			key = key.slice(this.prefix.length);

			index = key.lastIndexOf(this.suffix);
			if (index !== key.length - this.suffix.length)
				return;
			key = key.slice(0, index);

			var value = this.decoder(domEvent.newValue);
			this.onChange(key, value);
		};

		return ctor;
	}());
});
