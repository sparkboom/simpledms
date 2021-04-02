module.exports = {
  //
  // Parsers
  //
  // Parsers create ASTs from code files
  // The default is typically 'espree'.
  // 'babel-eslint' converts Babel ASTs into ESLint compatible ones.
  // '@typescript-eslint/parser' is designed to create ASTs from TypeScript files.
  // parser: 'babel-eslint',
  parser: 'babel-eslint',
  // These are options specific to the parser selected above
  parserOptions: {
    // project: './tsconfig.json', // @typescript-eslint/parser only
    ecmaVersion: 2019,
    sourceType: 'module',
    allowImportExportEverywhere: false,
    codeFrame: false,
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: true,
      jsx: true,
    },
  },
  //
  // Plug-Ins
  //
  // Any eslint-plugin- module installed via npm/yarn that should be utilized must be listed here
  // Plug-ins can provide processors, parsers, environments/globals, and rules/rulesets(extends)
  plugins: [
    // plugin companion to 'babel-eslint' parser.
    // It reimplements some rules so that experimental features do not appear as false-positives
    'babel',
    'import',
    'react',
    'react-hooks',
    'jsx-a11y',
    '@typescript-eslint',
  ],
  //
  // Processors
  //
  // Processors create JavaScript code from other codefiles, which are then analyzed into ASTs
  // Processors are sometimes provided by eslint-pugins
  // processors :
  //
  //
  //
  // Environments
  //
  // env allow us to define globals that already exist in a specific envrionment as a default
  // See list here https://eslint.org/docs/user-guide/configuring#specifying-environments
  // files can override this with header comment /* eslint-env node, mocha */
  env: {
    // es6 - allows us to define to 'es6' types such as Symbol, Set, Map, Promise etc
    es6: true,
    // browser - allows us to define browser globals such as DOM window etc
    browser: true,
    // jest - allows us to define Jest runner globals
    // commonjs - allows us to define commonjs-style node globals such as module
    // node - allows us to define node script globals, see https://nodejs.org/api/globals.html
  },
  //
  // Globals
  //
  // globals allow us to define/change definition of specific globals for our environment - readonly, writable, off
  // globals: {}
  //
  //
  //
  // Extends (rule sets)
  //
  // extends provides a means to set a set of rules, often provided as an installed node module beginning with eslint-config-
  // also provided as a plugin (prefix with plugin:) ,  you can also specify paths
  extends: [
    // 'eslint:all'
    'eslint:recommended',
    'airbnb',
    'prettier',
  ],
  //
  // Rules
  //
  // rules provides a means to configure individual rule in the form of 'plugInName/ruleName": [level, ...ruleConfig]
  // where level can be "off", "warn", "error", or 0,1,2 respectively; and ruleConfig is specific to the rule
  // rules can be expressed in files using /* eslint quotes: ["error", "double"], curly: 2 */
  // rules can be disabled using /* eslint-disable ... // eslint-disable-line, // eslint-disable-next-line etc
  rules: {
    'max-len': [
      'error',
      {
        code: 160,
      },
    ],
    'max-classes-per-file': ['warn'],
    'no-return-assign': ['off'],
    'prefer-promise-reject-errors': ['warn'],
    'import/prefer-default-export': ['off'],
    'react/jsx-filename-extension': ['off'],
    'react/prop-types': ['off'],
    'jsx-a11y/label-has-associated-control': ['warn'],
    'react/jsx-props-no-spreading': ['off'],
  },
  //
  // Overrides
  //
  // overrides array adapts rules depending on the 'files' globbing pattern, use 'excludedFiles' to pattern match exclusions
  // override configurations can include rules, processor
  // overrides
  //
  // Root
  //
  // root is true if the eslint configuration file is top-level - useful for codebase with multiple eslint configurations

  //
  // Settings
  //
  // settings
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
