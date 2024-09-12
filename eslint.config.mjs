import globals from "globals";
import tseslint from 'typescript-eslint';
import js from "@eslint/js";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.eslint.json"],
      },
    },

    rules: {
      "@typescript-eslint/await-thenable": "error",
      "prefer-arrow-callback": ["warn"],
    },
  }, {
  files: ["**/*.ts", "**/*.js"],
},
  {
    ignores: ["**/dist", "**/docs", "**/node_modules", "jest.config.js", "e2e/ts/jest.config.js", "eslint.config.mjs"],
  },
);
