/*
* Helpers for various task
*
*/

// Dependencies
var crypto = require('crypto');
var environment = require('./environment')


// Container for the helpers
var helpers = {};

// Create a SHA256 hash
helpers.hash = function (str) {
    if (typeof(str) == 'string' && str.length >= 4) {
        var hash = crypto.createHmac('sha256', environment.hashSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};

// Parse a json string to an object in all cases, without throwing
helpers.parseJsonToObject = function (str) {
    try {
        var obj = JSON.parse(str);
        return obj;
    } catch(e) {
        return {};
    }
}

// Export the module
module.exports = helpers;