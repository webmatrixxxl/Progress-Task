const path = require('path');
const devMode = process.env.NODE_ENV !== 'production'
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
  entry: {
    'main': './src/index.js'
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
           MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false, sourceMap: true } },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              config: {
                path: './postcss.config.js'
              },
              plugins: loader => [require('autoprefixer')()]
            }
          },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'style.css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new LiveReloadPlugin()
  ],
};
