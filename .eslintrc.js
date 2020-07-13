module.exports = {
  env: {
    browser: false,
    es2020: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'import/extensions': 0, // off
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts'],
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
};
