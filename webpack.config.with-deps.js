// Webpack config file that overrides the config created by 'webpack.config.factory.js' to ignore
// some dependencies.
const webpack = require('webpack');
const factory = require('./webpack.config.factory');

let config = factory({
  libraryName: 'aimsMap',
  filename: 'aims-map-withdeps.js',
  umdNamedDefine: true
});

console.log('output: ' + JSON.stringify(config.output));
// Add an IgnorePlugin for OpenLayers and jQuery.
config.plugins.push(new webpack.IgnorePlugin(new RegExp(`\\bol\\b`)));
config.plugins.push(new webpack.IgnorePlugin(new RegExp(`\\bjquery\\b`)));

module.exports = config;