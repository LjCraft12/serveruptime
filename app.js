/*
* Primary file for the API
*
* */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');

const message = require('./config/locals/english');
const environment = require('./config/environment');

// Instantiate the HTTP server
var httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res);
});

// Start the HTTP server, and have it listen on port xxx
httpServer.listen(environment.httpPort, function () {
    console.log(message.server.translation_0 + environment.httpPort);
});

// Instantiate the HTTPS server
var httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions, function (req, res) {
    unifiedServer(req, res);
});

// Start the HTTPS server
httpsServer.listen(environment.httpsPort, function () {
    console.log(message.server.translation_4 + environment.httpsPort);
});

// Create unified server that will hold logic for both http and https
var unifiedServer = function (req, res) {
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
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);

            // Send the response
            res.end(payloadStr);

            // Log the requested path
            console.log('Returning this response ', statusCode, payloadStr);
        });
    });
};

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