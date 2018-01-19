// Factory to generate a valid Webpack configuration object that can then be customised.
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Default output directory that can be overridden in options.
const OUTPUT_DIRECTORY = 'build';

// Function to generate the config.
module.exports = function(options) {

// Default plugins, simply clear the output directory unless overridden.
  let plugins = [];
  if (options.hasOwnProperty('cleanOutputDirectory') && !options.cleanOutputDirectory) {
    plugins.push(new CleanWebpackPlugin([OUTPUT_DIRECTORY]));
  }

  // Define the output name.
  let outputDirectory = options.outputDirectory || `${__dirname}/${OUTPUT_DIRECTORY}`;

  // Allow for overriding the default entry point.
  let entryPoint = (options.entryPoint ? options.entryPoint : __dirname + '/index.js');

  let config = {

    // Entry point.
    entry: entryPoint,

    // Output details for the library.
    output: {
      path: outputDirectory,
      filename: options.filename,
      library: options.libraryName,
      libraryTarget: options.libraryTarget || 'umd',
      umdNamedDefine: !!options.umdNamedDefine
    },

    // Default rule: transpile everything except contents of 'node_modules' and 'bower_components'.
    module: {
      rules: [
        {
          test: /(\.jsx|\.js)$/,
          loader: 'babel-loader',
          exclude: /(node_modules|bower_components)/
        }
      ]
    },

    // Define where to look for source files.
    resolve: {
      modules: [path.resolve('./node_modules'), path.resolve('./lib')],
      extensions: ['.json', '.js']
    },

    // Add plugins.
    plugins: plugins
  };

  // Generate source maps be default, unless 'sourceMaps' specified as 'false' in 'options'.
  if (options.hasOwnProperty('sourceMaps') && !options.sourceMaps) {
    // Do not generate source maps.
  } else {
    // Generate source maps.
    config.devtool = 'source-map';
  }

  return config;

}