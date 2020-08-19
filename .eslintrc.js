module.exports = {
    env: {
        browser: true,
        node: true
    },
    parser: 'babel-eslint',
    extends: ['airbnb', 'plugin:prettier/recommended', 'prettier/standard', 'plugin:json/recommended'],
    rules: {
        'no-console': 0,
        'import/no-extraneous-dependencies': [1, { devDependencies: true }]
    }
};
