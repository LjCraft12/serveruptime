/*
* Primary file for the API
*
* */

// Dependencies
const http = require('http');
const url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

const config = require('./config/server/server');
const message = require('./config/locals/english')

// The server should respond to all request with a string
var server = http.createServer(function (req, res) {

    // Get the UL and parse it
    var parsedUrl = url.parse(req.url, true)

    // Get the path from the URL
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    var queryStr = parsedUrl.query;

    // Get the HTTP method
    var method = req.method.toLowerCase();

    // Get the headers as an object
    var headers = req.headers;

    // get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function () {
        buffer += decoder.end();

        // Choose the handler this request should go to if one is not found use the notFound handler
        var choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStr,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        // Route the request to the handler specified in the router
        choosenHandler(data, function (statusCode, payload) {
            // Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default to an empty object
            payload - typeof(payload) == 'object' ? payload : {};

            // Convert the payload to a string
            var payloadStr = JSON.stringify(payload);

            // Return a response
            res.writeHead(statusCode)

            // Send the response
            res.end(payloadStr);

            // Log the requested path
            console.log('Returning this response ', statusCode, payloadStr);
        });
    });
});

// Start the server, and have it listen on port xxx
server.listen(config.server.port, function () {
    console.log(message.server.translation_0 + config.server.port)
});

// Define handlers
var handlers = {};

// Sample handler
handlers.sample = function (data, callback) {
//    Callback a HTTP status code, and payload object
    callback(406, {'name': 'sample handler'})
};

// Not found handler
handlers.notFound = function (data, callback) {
    callback(406)
};

// Define a request router
var router = {
    'sample': handlers.sample
}