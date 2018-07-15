const path = require('path');
const devMode = process.env.NODE_ENV !== 'production'
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
  entry: {
    'main': './src/index.js',
    'accordion.kendoUI': './src/js/accordion.kendoUI.js'
  },
  resolve: {
    extensions: ['.js', '.css', '.scss', '.sass']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['es2015'] }
        }
      },
      {
        // css / sass / scss loader for webpack
        test: /\.(css|sass|scss)$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new LiveReloadPlugin()
  ],
};
