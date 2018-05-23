/*
* Request Handlers
*
*/

// Dependencies
var messages = require('../config/locals/english')
var helpers = require('./helpers');
_data = require('./data');

// Container for the user submethods
handlers = {};

// Users
handlers.users = function (data, callback) {
  var acceptedMethods = ['post', 'get', 'put', 'delete'];
  if(acceptedMethods.indexOf(data.method) > -1) {
      handlers._users[data.method](data, callback);
  } else {
      callback(405);
  }
};

// Container for all the users methods
handlers._users ={};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data
handlers._users.post = function (data, callback) {
    // Check that all required fields are filled out
    var firstName =typeof(data.payload.firstName) == 'string' && data.payload.firstName().length > 0 ? data.payload.firstName.trim() : false;
    var lastName =typeof(data.payload.lastName) == 'string' && data.payload.lastName().length > 0 ? data.payload.lastName.trim() : false;
    var phone =typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password =typeof(data.payload.password) == 'string' && data.payload.password.trim().length >= 4 ? data.payload.password.trim() : false;
    var tosAgreement =typeof(data.payload.password) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure the user doesn't exist
        _data.read('users', phone, function (err, data) {
            if(err) {
                // Hash password
                var hashedPassword = helpers.hash(password);

                // Create user object
                if (hashedPassword){
                    var userObject = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'phone': phone,
                        'password': hashedPassword,
                        'tosAgreement': true
                    };

                    // Store the user
                    _data.create('users', phone, userObject, function (err) {
                        if(!err) {
                            callback(200)
                        } else {
                            console.log(err);
                            callback(500, {'Error': messages.user.translation_0});
                        }
                    });
                } else {
                    callback(500, {'Error': messages.user.translation_1})
                }


            } else {
                // User already exist
                callback(400, {'Error' : messages.handlers.translation_0})
            }
        });
    } else {
        callback(400, {'Error': messages.handlers.translation_1});
    }

};

// Users - get
handlers._users.get = function (data, callback) {

};

// Users - put
handlers._users.put = function (data, callback) {

};

// Users - delete
handlers._users.delete = function (data, callback) {

};

// Define handlers
var handlers = {};

// Ping handler
handlers.ping = function (data, callback) {
    callback(200);
};

// Not found handler
handlers.notFound = function (data, callback) {
    callback(404)
};

module.exports = handlers;