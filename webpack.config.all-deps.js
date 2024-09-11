// Webpack config file that does not override the config created by 'webpack.config.factory.js'.
const factory = require('./webpack.config.factory');

let config = factory({
  entryPoint: __dirname + '/index-all-deps.js',
  filename: 'mapping-client-alldeps.js',
  libraryName: 'mappingClient',
  providePlugins: true
});

module.exports = config;
