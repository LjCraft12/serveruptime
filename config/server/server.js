module.exports = {
    environment: {
        dev: {
            httpPort: 3000,
            httpsPort: 3001,
            envName: 'staging'
        },
        prod: {
            httpPort: 5000,
            httpsPort: 5001,
            envName: 'production'
        }
    }
};