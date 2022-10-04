module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    'import-first': 'off',
    camelcase: 'off',
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
  },
};
