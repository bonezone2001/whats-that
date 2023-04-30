module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
    ],
    overrides: [
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
    ],
    rules: {
        indent: ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
        'react/no-unstable-nested-components': 'off',
        'linebreak-style': ['error', 'windows'],
        'import/prefer-default-export': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/forbid-prop-types': 'off',
        'import/no-unresolved': 'off',
        'no-use-before-define': 'off',
        'no-nested-ternary': 'off',
        'global-require': 'off',
        'no-bitwise': 'off',
        'no-plusplus': 'off',
        'no-continue': 'off',
    },
};
