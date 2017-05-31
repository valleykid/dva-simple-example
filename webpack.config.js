'use strict';

const webpack = require('atool-build/lib/webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlhashFix = require('html-webpack-hashfix-plugin');
const path = require('path');

function getMultiPage(config) {
  Object.keys(config.entry).forEach((entry) => {
    let title;
    switch(entry) {
      case 'user':
        title = 'user dashboard';
        break;
      default:
        title = 'csmobile';
    }
    config.plugins.push(new HtmlWebpackPlugin({
      inject: false,
      minify: { collapseWhitespace: true },
      filename: entry + '.html',
      env: process.env.NODE_ENV,
      title, entry,
      template: path.join(__dirname, 'src/default.ejs'),
    }));
  });
}

module.exports = function(webpackConfig, env) {
  webpackConfig.devtool = 'source-map';
  getMultiPage(webpackConfig);

  webpackConfig.plugins.push(new HtmlhashFix());
  webpackConfig.babel.plugins.push('transform-runtime',
  ['import', {
    style: true,
    libraryName: 'antd',
  }]);
  webpackConfig.module.loaders.some((item, i) => {
    if (typeof item.test === 'function') {
      // webpackConfig.babel.presets.splice(i, 1, require.resolve('babel-preset-stage-0-promises'));
      item.test = filePath => /\.css$/.test(filePath);
      item.loader = item.loader.replace('css-loader/index.js?', 'css-loader/index.js?modules&');
      return true;
    }
  });

  if (process.env.NODE_ENV === 'production') {
    webpackConfig.externals = {
      'react': 'React',
      'react-dom': 'ReactDOM',
    };
  }
  return webpackConfig;
};
