// Webpack config file that overrides the config created by 'webpack.config.factory.js' to ignore
// all dependencies specified in package.json.
const webpack = require('webpack');

const factory = require('./webpack.config.factory');

let config = factory({
  filename: 'aims-map-nodeps.js',
  libraryName: 'aims-map-nodeps'
});

// Add an IgnorePlugin for each defined dependency.
Object.keys(require('./package.json').dependencies)
  .forEach(lib => {
    config.plugins.push(new webpack.IgnorePlugin(new RegExp(`\\b${lib}\\b`)));
  });

module.exports = config;
