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
            "@api": "./api",
          },
        },
      ],
    ],
  };
};
