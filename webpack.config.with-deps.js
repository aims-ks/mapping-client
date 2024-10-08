// Webpack config file that overrides the config created by 'webpack.config.factory.js' to ignore
// some dependencies.
const webpack = require('webpack');
const factory = require('./webpack.config.factory');

const config = factory({
  libraryName: 'mappingClient',
  filename: 'mapping-client-withdeps.js',
  umdNamedDefine: true,
  externals: {
    jquery: 'jQuery',
  },
});

// Add an IgnorePlugin for OpenLayers.
config.plugins.push(new webpack.IgnorePlugin({
  resourceRegExp: /\bol\b/,
}));

module.exports = config;
