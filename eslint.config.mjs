import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    // For all regular JS files (non-test), assume CommonJS and Node.js globals.
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: 2021,
      globals: { ...globals.node }
    }
  },
  {
    // For test files, use module syntax and Node.js globals.
    files: ["**/*.test.js"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: 2021,
      globals: { ...globals.node }
    }
  },
  {
    // If some files run in the browser, you can add browser globals.
    // (Adjust or remove this block if it causes conflicts.)
    languageOptions: {
      globals: { ...globals.browser }
    }
  },
  pluginJs.configs.recommended,
];
