/**
 * Function that returns default values.
 * Used because Object.assign does a shallow instead of a deep copy.
 * Using [].push will add to the base array, so a require will alter
 * the base array output.
 */
'use strict';

const path = require('path');
const srcPath = path.join(__dirname, '/../src');
const pkgPath = path.join(__dirname, '/../package.json');
const dfltPort = 3002;
const apiPort = 3003;

const pkg = require(pkgPath);
let theme = {};
if (pkg.theme && typeof(pkg.theme) === 'string') {
  let cfgPath = path.join(__dirname, '/../'+pkg.theme);;
  const getThemeConfig = require(cfgPath);
  theme = getThemeConfig() || {};
} else if (pkg.theme && typeof(pkg.theme) === 'object') {
  theme = pkg.theme;
}
theme = JSON.stringify(theme);
/**
 * Get the default modules object for webpack
 * @return {Object}
 */
function getDefaultModules() {
  return {
    preLoaders: [
      // {
      //   test: /\.(js|jsx)$/,
      //   include: srcPath,
      //   loader: 'eslint-loader'
      // }
    ],
    loaders: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader!postcss-loader'
    }, {
      test: /\.less/,
      loader: `style-loader!css-loader!postcss-loader!less-loader?{"sourceMap":true,"modifyVars":${theme}}`,
    }, {
      test: /\.(png|jpg|gif|woff|woff2)$/,
      loader: 'url-loader?limit=8192',
    }, {
      test: /\.(mp4|ogg)$/,
      loader: 'file-loader'
    }, {
      test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/font-woff',
    }, ]
  };
}

module.exports = {
  srcPath: srcPath,
  publicPath: '/assets/',
  port: dfltPort,
  apiPort: apiPort,
  getDefaultModules: getDefaultModules
};
