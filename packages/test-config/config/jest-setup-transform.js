const { resolve } = require('path');
const babelOptions = require('../../../babel.config')();

babelOptions.plugins = ['require-context-hook', ...babelOptions.plugins];

module.exports = require('ts-jest').createTransformer({
  tsConfig: resolve(__dirname, '../../../jest.tsconfig.json'),
  diagnostics: false,
  babelConfig: babelOptions
});
