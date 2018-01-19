// Webpack config file that does not override the config created by 'webpack.config.factory.js'.
const factory = require('./webpack.config.factory');

let config = factory({
  libraryName: 'aims-map-alldeps'
});

module.exports = config;