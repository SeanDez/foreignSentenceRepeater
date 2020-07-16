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
    // ESLint doesn't understand these for Typescript
    // TSC will throw on errors though
    'import/named': 0, // off
    'import/no-unrseolved': 0,
    'import/extensions': 0,
    'no-undef': 0,
    'no-unused-vars': 0,
    'no-console': 0, // needed for this CLI app
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
