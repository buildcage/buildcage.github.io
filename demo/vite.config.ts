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

  run: {
    tasks: {
    // A full render takes minutes, and the site is rebuilt far more often than
    // the video changes. Declaring the inputs lets the cache skip it entirely
    // unless something under src/ or public/ actually moved.
    render: {
      command: [
        "remotion render Demo out/demo.mp4 --crf=28",
        "remotion still Poster out/demo-poster.png",
      ],
      input: ["src/**", "public/**", "package.json", "remotion.config.ts"],
      output: ["out/demo.mp4", "out/demo-poster.png"],
    },

    "render:gif": {
      command:
        "remotion render DemoShort out/demo.gif --codec=gif --scale=0.5 --every-nth-frame=2",
      input: ["src/**", "public/**", "package.json", "remotion.config.ts"],
      output: ["out/demo.gif"],
    },
    },
  },
});
