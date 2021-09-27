module.exports = {
  env: {
    es6: true,
    'jest/globals': true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'prettier'],
  overrides: [
    {
      files: 'e2e/**/*.js',
      parser: '@babel/eslint-parser',
      parserOptions: {
        allowImportExportEverywhere: false,
        ecmaFeatures: {
          globalReturn: false,
        },
        requireConfigFile: false,
        sourceType: 'module',
      },
    },
    {
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      files: '**/*.ts',
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.lint.json',
      },
      plugins: ['@typescript-eslint/eslint-plugin'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
  plugins: ['jest', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
      },
    ],
  },
};
