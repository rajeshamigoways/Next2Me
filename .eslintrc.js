module.exports = {
    extends: ['next', 'next/core-web-vitals', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2021, // Supports modern JavaScript
      sourceType: 'module', // Allows the use of imports
    },
    rules: {
        '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars':  'off',
      'no-unused-vars': 'off', 
      '@next/next/no-img-element': ['warn'], 
      '@typescript-eslint/no-explicit-any': 'error', 
      '@typescript-eslint/no-explicit-any': 'off',

      
      'react/no-unescaped-entities': 'off',

      '@next/next/no-img-element': 'off',
  
      'react-hooks/exhaustive-deps': 'off',
    },
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
  };
  