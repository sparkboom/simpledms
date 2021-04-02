/**
 * This webpack configuration is for the sole use of Storybook UI tooling
 */
const webpack = require('webpack');
const merge = require('webpack-merge');
const util = require('util');
const uxWebpackConf = require('../config/webpack.ux.conf');

const opts = {
  outputPath: '.build/',
  build: 'development',
  outputFileName: 'index.html',
  envVars: {},
};

// Rules
const RULE__STORIES = {
  test: [/\.stories\.jsx?$/, /\.stories\.tsx?$/],
  loaders: [require.resolve('@storybook/source-loader')],
  enforce: 'pre',
};

// Webpack Config
module.exports = async ({ config }) => {

  // Remove some old rules that conflict with our webpack configuration
  const { module } = config;
  const rulesToRemove = [
    // '/\\.(mjs|tsx?|jsx?)$/',
    // '/\\.js$ /',
    // '/\\.md$/',
    // '/\\.css$ /',
    '/\\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\\?.*)?$/',
    '/\\.(mp4|webm|wav|mp3|m4a|aac|oga)(\\?.*)?$/',
  ];
  module.rules = module.rules.filter(r => !rulesToRemove.includes(r.test.toString()));

  const sbWebpackConfig = merge(
    {},
    uxWebpackConf(opts, config),
    {
      module: {
        rules: [
          RULE__STORIES,
        ]
      }
    });
  console.log(util.inspect(sbWebpackConfig, { showHidden: false, depth: null, colors: true }));
  return sbWebpackConfig;
};
