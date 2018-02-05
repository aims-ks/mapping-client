// Webpack config file that does not override the config created by 'webpack.config.factory.js'.
const factory = require('./webpack.config.factory');

let config = factory({
  entryPoint: __dirname + '/index-all-deps.js',
  filename: 'aims-map-alldeps.js',
  libraryName: 'aimsMap',
  providePlugins: true
});

module.exports = config;
