const path = require('path');
const devMode = process.env.NODE_ENV !== 'production'
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'main': './src/index.js'
  },
  resolve: {
    extensions: ['.js', '.css', '.scss', '.sass']
  },
  devServer: {
    compress: true,
    port: 3333
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            interpolate: true
          }
        }],
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['es2015'] }
        }
      },
      {
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
      filename: 'assets/css/style.css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new LiveReloadPlugin({
      appendScriptTag: true
    }),
    new CopyWebpackPlugin([
      { from: 'src/assets/img', to: 'assets/img' },
      { from: 'src/assets/svg', to: 'assets/svg' }
    ]),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ],
};

