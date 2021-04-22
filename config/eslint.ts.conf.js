const { resolve } = require('path');

module.exports = {
  files: ['**/*.ts', '**/*.tsx'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: resolve('./tsconfig.json'),
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
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'airbnb',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  rules: {
    'import/prefer-default-export': ['off'],
    'no-undef': ['off'],
    'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-props-no-spreading': ['off'],
    'react/prop-types': ['off'],
    '@typescript-eslint/unbound-method': ['off'],
    'import/extensions': [
      'error', {
        'ts': 'never',
        'tsx': 'never',
        'js': 'never',
        'jsx': 'never',
        'json': 'never'
      }
    ],
    "max-classes-per-file": ["error", 1]
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
