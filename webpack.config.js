const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

// Thank you so much: https://github.com/gorhom/react-native-bottom-sheet/issues/11#issuecomment-916025454
module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(
        {
            ...env,
            babel: { dangerouslyAddModulePathsToTranspile: ['@gorhom'] },
        },
        argv,
    );

    config.resolve = {
        ...config.resolve,
        alias: {
            ...config.resolve.alias,
            react: path.resolve(__dirname, 'node_modules/react'),
        },
    };

    return config;
};
