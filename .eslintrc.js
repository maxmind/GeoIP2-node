module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "prettier"
  ],
  "overrides": [
    {
      "env": {
        "jest": true,
      },
      "files": [
        "**/*.spec.js",
      ],
    },
    {
      "extends": [
        "plugin:@typescript-eslint/recommended",
      ],
      "files": [
        '**/*.ts'
      ],
      "parser": "@typescript-eslint/parser",
      "parserOptions": {
        "project": "./tsconfig.eslint.json",
        "sourceType": "module"
      },
      "plugins": [
        "@typescript-eslint"
      ],
      "rules": {}
    }
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
  },
  "plugins": [
      "eslint-plugin-prefer-arrow",
  ],
  "rules": {}
};
