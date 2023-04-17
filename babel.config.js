module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // add path alias
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@components': './components',
            '@screens': './screens',
            '@utils': './utils',
            '@assets': './assets',
            "@styles": "./styles"
          },
        },
      ]
    ],
  };
};