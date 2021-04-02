const eslintTypescriptConf = require('./config/eslint.ts.conf');
const eslintJsxConf = require('./config/eslint.jsx.conf');
const eslintRootConf = require('./config/eslint.root.conf');

module.exports = {
  ...eslintRootConf,
  overrides: [eslintTypescriptConf, eslintJsxConf],
};
