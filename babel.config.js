module.exports = function (api) {
  api && api.cache(true);

  const presets = [
    '@babel/env',
    '@babel/react',
    '@babel/typescript'
  ];
  const plugins = [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-namespace-from',
    'emotion'
  ];

  const babelrcRoots = [
    '.',
    'packages/*',
  ];

  return {
    presets,
    plugins,
    babelrcRoots,
  };
}
