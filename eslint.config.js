import globals from "globals"
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    rules: {
      "semi": 0,
      "@typescript-eslint/no-explicit-any": 0,
      "no-unused-vars": 0,
      'vue/multi-word-component-names': 0,
      '@typescript-eslint/no-require-imports': 'error',
    },
  },
  {languageOptions: { globals: globals.browser }},
  ...tseslint.configs.recommended,
];