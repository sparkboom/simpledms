/**
 * webpack.ux.conf - this partial configuration contains the means to build the UX components and
 * the necessary modules of the lightning design system. This configuration file is used by both the
 * @sparkboom-smds/app project, and the Storybook UI tool.
 *
 */
const { resolve, relative } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const babelConfig = require('../../../babel.config');
const SpritesmithPlugin = require('webpack-spritesmith');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

// Constants
const PATH_SDMS_ASSETS = resolve(__dirname, '../assets/');

// Rules
const RULE__SR_UX = {
  test: [/\.jsx?$/, /\.tsx?$/],
  include: [resolve(__dirname, '../src/'),resolve(__dirname, '../node_modules/semantic-ui-css')],
  use: {
    loader: 'babel-loader',
    options: {
      rootMode: 'upward',
    },
  },
};

const RULE__SVG_ASSETS = {
  test: /\.svg$/,
  use: {
    loader: '@svgr/webpack',
    options: {
      jsx: true,
    },
  },
};

const RULE__WOFF_ASSETS = {
  test: /\.(woff|woff2|ttf|otf|eot)$/,
  // include: [resolve(__dirname, '../assets/fonts/web')],
  use: {
    loader: 'file-loader',
    options: {
      name: '[name].[ext]',
      outputPath: url => `assets/fonts/${url}`,
    }
  },
};

// Default Graphic Assets, without fonts
const RULE__DEFAULT_GRAPHIC_ASSETS = {
  // test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
  test: /\.(svg|ico|jpg|jpeg|png|gif|webp|cur|ani|pdf)(\?.*)?$/,
  use: {
    loader: 'file-loader',
    options: {
      name: 'static/media/[name].[hash:8].[ext]',
    },
  },
};

const RULE__DEFAULT_MEDIA_ASSETS = {
  // test:  /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
  test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
  use: {
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: 'static/media/[name].[hash:8].[ext]',
    },
  },
};

// Webpack
module.exports = (opts, webpackConf = {}) =>
  merge({}, {
    module: {
      rules: [RULE__SR_UX, RULE__SVG_ASSETS, RULE__DEFAULT_GRAPHIC_ASSETS, RULE__DEFAULT_MEDIA_ASSETS, RULE__WOFF_ASSETS],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    plugins: [
      new SpritesmithPlugin({
        src: {
          cwd: PATH_SDMS_ASSETS,
          glob: '*.png'
        },
        target: {
          image: `${opts.outputPath}/assets/images/sprites/sprite.png`,
          css: [[`${opts.outputPath}/assets/css/assets.css`, { format: 'css' }]],
        },
        apiOptions: {
          cssImageRef: `/assets/images/sprites/sprite.png`,
        }
      }),
    ],
  }, webpackConf);
