// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["eslint.config.js", "vitest.config.js", "**/*.d.ts"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    ignores: ["**/coverage/*", "**/dist/*"],
  }
);
