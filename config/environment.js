/*
*  Create and export configuration variables
*/

// Custom imports
var config = require('../config/server/server');


// Container for all the variables
var environments = {};

// Staging {default} environment
environments.staging = {
    'httpPort': config.environment.dev.httpPort,
    'httpsPort': config.environment.dev.httpsPort,
    'envName': config.environment.dev.envName
};

// Production environment
environments.production = {
    'httpPort': config.environment.prod.httpPort,
    'httpsPort': config.environment.prod.httpsPort,
    'envName': config.environment.prod.envName
};

// Determine which enviroment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;