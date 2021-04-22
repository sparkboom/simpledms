module.exports = {
  files: 'src/**/*.(jsx)',
  extends: ['eslint:recommended', 'plugin:react/recommended', 'airbnb', 'prettier'],
  rules: {
    'react/prop-types': ['off'],
  },
};
