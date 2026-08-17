import { defineConfig } from "vite-plus";

// Rendered videos — generated output, never lint/format them.
const renderedOutput = ["out/**"];

export default defineConfig({
  lint: {
    ignorePatterns: renderedOutput,
  },
  fmt: {
    ignorePatterns: renderedOutput,
  },
  staged: {
    "*.{ts,tsx,json,jsonc,md}": "vp check --fix",
  },
});
