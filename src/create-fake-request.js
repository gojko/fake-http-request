/*global module, require */
var FakeCall = require('./fake-call');

module.exports = function createFakeRequest() {
	'use strict';
	var calls = [],
		pipes = [],
		result = function () {
			var argsArray = [].slice.apply(arguments),
			listeners = {},
			bodyBuffer = [],
			fake = {
				on: function (eventName, listener) {
					listeners[eventName] = listener;
					return fake;
				},
				end: function () {
					return fake;
				},
				write: function (content, encoding, callback) {
					bodyBuffer.push(content);
					if (callback) {
						callback();
					}
					return fake;
				}
			};
			calls.push(new FakeCall(argsArray, listeners, bodyBuffer));
			pipes.forEach(function (pipe) {
				pipe.apply({}, argsArray);
			});
			return fake;
		};
	result.calls = calls;
	result.pipe = function (f) {
		pipes.push(f);
	};
	return result;
};
