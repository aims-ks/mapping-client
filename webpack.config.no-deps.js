// Webpack config file that overrides the config created by 'webpack.config.factory.js' to ignore
// all dependencies specified in package.json.
const webpack = require('webpack');

const factory = require('./webpack.config.factory');

const config = factory({
  filename: 'mapping-client-nodeps.js',
  libraryName: 'mapping-client-nodeps',
});

// Add an IgnorePlugin for each defined dependency.
Object.keys(require('./package.json').dependencies)
  .forEach((lib) => {
    config.plugins.push(new webpack.IgnorePlugin({
      resourceRegExp: new RegExp(`\\b${lib}\\b`),
    }));
  });

module.exports = config;
