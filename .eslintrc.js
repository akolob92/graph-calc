module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jasmine: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'indent': ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
    'no-console': ['error', { allow: ['warn', 'error', 'debug'] }],
  },
};
