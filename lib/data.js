/*
* Library for storing and editing data
*
*/

// Dependencies
var fs = require('fs');
var path = require('path');

// Custom dependencies
var messages = require('../config/locals/english');

// Container for the module to be exported
var lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = function (dir, file, data, callback) {
    // Open the file to be written
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            // Convert data to string
            var stringData = JSON.stringify(data);

           // Write to file and close it
           fs.writeFile(fileDescriptor, stringData, function (err) {
              if (!err) {
                  fs.close(fileDescriptor, function (err) {
                      if (!err) {
                          callback(false);
                      } else {
                          callback(messages.fileSystem.translation_2)
                      }
                  });
              } else {
                  callback(messages.fileSystem.translation_1)
              }
           });
        } else {
            callback(messages.fileSystem.translation_0);
        }
    });
};

// Read data from file
lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function(err,data){
        if(!err && data){
            var parsedData = helpers.parseJsonToObject(data);
            callback(false,parsedData);
        } else {
            callback(err,data);
        }
    });
};

// Update data inside a file
lib.update = function(dir, file, data, callback) {
  // Open the file for writing
  fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function (err, fileDescriptor) {
      if(!err && fileDescriptor) {
          // Convert data to string
          var stringData = JSON.stringify(data);

          // Truncate the file
          fs.truncate(fileDescriptor, function (err) {
              if(!err) {
                  // Write to file and close it
                  fs.writeFile(fileDescriptor, stringData, function (err) {
                      if(!err) {
                          fs.close(fileDescriptor, function (err) {
                              if(!err){
                                  callback(false);
                              } else {
                                  callback(messages.fileSystem.translation_6);
                              }
                          })
                      } else {
                          callback(messages.fileSystem.translation_5)
                      }
                  })
              } else {
                  callback(messages.fileSystem.translation_4);
              }
          });
      } else {
          callback(messages.fileSystem.translation_3);
      }
  });
};

// Delete file
lib.delete = function (dir, file, callback) {
  // Unlink file from file system
  fs.unlink(lib.baseDir + dir + '/' + file + '.json', function (err) {
      if(!err) {
          callback(false);
      } else {
          callback(messages.fileSystem.translation_7)
      }
  })
};

// Export the module
module.exports = lib;