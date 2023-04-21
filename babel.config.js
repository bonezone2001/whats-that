module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@components": "./components",
            "@navigator": "./navigator",
            "@utils": "./utils",
            "@assets": "./assets",
            "@styles": "./styles",
            "@locales": "./locales",
            "@locales": "./locales",
            '@store': './store',
            "@api": "./api",
          },
        },
      ],
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin',
    ],
  };
};
