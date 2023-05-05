module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    alias: {
                        '@components': './src/components',
                        '@navigator': './src/navigator',
                        '@utils': './src/utils',
                        '@assets': './src/assets',
                        '@styles': './src/styles',
                        '@locales': './src/locales',
                        '@store': './src/store',
                        '@hooks': './src/hooks',
                        '@api': './src/api',
                    },
                },
            ],
            '@babel/plugin-proposal-export-namespace-from',
            'react-native-reanimated/plugin',
        ],
    };
};
