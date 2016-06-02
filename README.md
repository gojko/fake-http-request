# Fake Node.js HTTP Request 

Utility class to fake a HTTP/HTTPS request for unit testing Node.js projects. It captures arguments for outgoing requests and allows you to simulate network errors and responses easily.

## Installation


```
npm install fake-http-request
```

## Usage

Before the relevant HTTP/S requests, install the fake request:

```javascript
var fake = require('fake-http-request');

fake.install('https');

```

To clean up and restore the original HTTP/S requests, after testing, use:

```javascript
fake.uninstall('https');
```

This will replace the system `https.request` with a test method that captures calls instead of sending them out to the network, so it will work with any client code that uses the system http/https libraries.

Both `install` and `uninstall` can take an argument -- the module name where to install the fake requests. By default, they will use `https`.

You can then use `https.request.calls` to inspect individual calls. Each call object will have the following structure:

* `args`: `array` -- arguments passed to the request
* `body`: `array` -- chunks written to the request body
* `networkError`: `function (error)` -- use this to simulate a network error for the call.
* `respond`: `function(httpCode, statusMessage, body)` -- use this to simulate a successful network response.

### Example

```javascript
var fakeRequest = require('fake-http-request'),
    https = require('https'),
    request = require('request');

fakeRequest.install();

request('https://www.google.com', function (error, response, body) { 
  console.log('got response', response.statusCode, response.statusMessage, body) 
}).on('request', function () {
  console.log('number of calls', https.request.calls.length);
  console.log('first call', https.request.calls[0].args[0].host, https.request.calls[0].args[0].port, https.request.calls[0].args[0].path);
  // simulate a response
  https.request.calls[0].respond(404, 'Not found', 'some html here');
});


call = request('https://www.google.com', function (error, response, body) { 
  console.log('got error', error); 
}).on('request', function () {
  var mostRecent = https.request.calls.length - 1;
  console.log('number of calls', https.request.calls.length);
  console.log('second call', https.request.calls[mostRecent].args[0].host, https.request.calls[mostRecent].args[0].port, https.request.calls[mostRecent].args[0].path);
  // simulate a response
  https.request.calls[mostRecent].networkError('BOOM!');
});

```
