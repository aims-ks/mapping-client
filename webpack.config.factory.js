// Factory to generate a valid Webpack configuration object that can then be customised.
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Default output directory that can be overridden in options.
const OUTPUT_DIRECTORY = 'build';

// Function to generate the config.
module.exports = (options) => {

  // Default plugins, simply clear the output directory unless overridden.
  const plugins = [];

  if (
    Object.prototype.hasOwnProperty.call(options, 'cleanOutputDirectory')
    && !options.cleanOutputDirectory
  ) {
    plugins.push(new CleanWebpackPlugin([OUTPUT_DIRECTORY]));
  }

  if (
    Object.prototype.hasOwnProperty.call(options, 'providePlugins')
    && options.providePlugins
  ) {
    plugins.push(new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      ol: 'ol',
    }));
  }

  // Define the output name.
  const outputDirectory = options.outputDirectory || `${__dirname}/${OUTPUT_DIRECTORY}`;

  // Allow for overriding the default entry point.
  const entryPoint = options.entryPoint ? options.entryPoint : path.join(__dirname, 'index.js');

  // Allow for overriding the provision of external libraries.
  const externals = (options.externals ? options.externals : {});

  const config = {

    // Entry point.
    entry: entryPoint,

    // Output details for the library.
    output: {
      path: outputDirectory,
      filename: options.filename,
      library: options.libraryName,
      libraryTarget: options.libraryTarget || 'umd',
      umdNamedDefine: !!options.umdNamedDefine,
    },

    // Provision of external libraries
    externals,

    // Default rule: transpile everything except contents of 'node_modules' and 'bower_components'.
    module: {
      rules: [
        {
          test: /(\.jsx|\.js)$/,
          loader: 'babel-loader',
          exclude: /(node_modules|bower_components)/,
        },
        // SASS/CSS.
        {
          test: /\.scss$|\.css$/,
          use: [{
            loader: 'style-loader', // creates style nodes from JS strings
          }, {
            loader: 'css-loader', // translates CSS into CommonJS
          }, {
            loader: 'sass-loader', // compiles Sass to CSS
          }],
        },
        {
          test: /.(png|woff(2)?|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url-loader',
          options: {
            limit: 100000,
          },
        },
        {
          test: /\.txt$/,
          use: 'raw-loader',
        },
      ],
    },

    // Define where to look for source files.
    resolve: {
      modules: [path.resolve('./node_modules'), path.resolve('./lib')],
      extensions: ['.json', '.js'],
    },

    // Add plugins.
    plugins,
    watchOptions: {
      ignored: '/node_modules/',
    },
  };

  // Generate source maps be default, unless 'sourceMaps' specified as 'false' in 'options'.
  if (
    Object.prototype.hasOwnProperty.call(options, 'sourceMaps')
    && !options.sourceMaps
  ) {
    // Do not generate source maps.
  } else {
    // Generate source maps.
    config.devtool = 'source-map';
  }

  return config;
};
