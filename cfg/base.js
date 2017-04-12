'use strict';
let path = require('path');
let defaultSettings = require('./defaults');

// Additional npm or bower modules to include in builds
// Add all foreign plugins you may need into this array
// @example:
let npmBase = path.join(__dirname, '../node_modules');
// let additionalPaths = [ path.join(npmBase, 'react-bootstrap') ];
let additionalPaths = [];

module.exports = {
  additionalPaths: additionalPaths,
  port: defaultSettings.port,
  apiPort: defaultSettings.apiPort,
  debug: true,
  devtool: 'eval',
  // output: {
  //   path: path.join(__dirname, '/../dist/assets'),
  //   filename: 'app.js',
  //   publicPath: defaultSettings.publicPath
  // },
  output: {
    path: path.resolve(__dirname, '../dist/assets'),
    publicPath: defaultSettings.publicPath,
    filename: "[name].bundle.js"
  },
  devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    port: defaultSettings.port,
    publicPath: defaultSettings.publicPath,
    noInfo: false,
    stats: {
      colors: true
    },
    proxy: {
      '/qm/api/*': {
        target: `http://localhost:${defaultSettings.apiPort}/qm_api/`,
        secure: false,
      }
      //  '/qm/*': {
      //      target: `http://localhost:8080`,
      //      secure: false,
      //      changeOrigin: true,
      //  },
      //  '/qm/api/*': {
      //      target: `http://localhost:8080`,
      //      secure: false,
      //      changeOrigin: true,
      //  }
    }
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      actions: `${defaultSettings.srcPath}/actions/`,
      components: `${defaultSettings.srcPath}/components/`,
      common: `${defaultSettings.srcPath}/common/`,
      stores: `${defaultSettings.srcPath}/stores/`,
      routes: `${defaultSettings.srcPath}/routes/`,
      styles: `${defaultSettings.srcPath}/styles/`,
      config: `${defaultSettings.srcPath}/config/` + process.env.REACT_WEBPACK_ENV
    }
  },
  postcss: function () {
    return [
      require('autoprefixer'),
    ];
  },
  module: {}
};
