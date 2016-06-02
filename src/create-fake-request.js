/*global module, require */
var FakeCall = require('./fake-call');

module.exports = function createFakeRequest() {
	'use strict';
	var calls = [],
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
			return fake;
		};
	result.calls = calls;
	return result;
};
