import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      all: true,
      exclude: [
        "dist/**",
        "eslint.config.js",
        "vitest.config.js"
      ],
      reporter: ["lcov", "text", "cobertura"],
    },
    reporters: ["junit", "default", "hanging-process"],
    outputFile: "mcos.junit.xml",
    pool: "forks",
    watch: false,
  },
});