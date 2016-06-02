/*global require, module */
var createFakeRequest = require('./src/create-fake-request'),
	oldRequests = {},
	installFake = function (type) {
		'use strict';
		var target = type || 'https',
			requestModule = require(target);
		if (oldRequests[target]) {
			throw new Error('Fake HTTP request is already installed in ' + target);
		}
		oldRequests[target] = requestModule.request;
		requestModule.request = createFakeRequest();
	},
	uninstallFake = function (type) {
		'use strict';
		var target = type || 'https',
			requestModule = require(target);
		if (!oldRequests[target]) {
			throw new Error('Fake HTTP request is not installed in ' + target);
		}
		requestModule.request = oldRequests[target];
		oldRequests[target] = undefined;
	};
module.exports = {
	install: installFake,
	uninstall: uninstallFake
};
