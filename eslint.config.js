// eslint.config.js
module.exports = [
  {
    ignores: ['node_modules/', '.next/', 'out/'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        Promise: 'readonly',
        Set: 'readonly',
        Math: 'readonly',
        Date: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];
