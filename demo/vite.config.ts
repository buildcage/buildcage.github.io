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
    // unless the scenes — or the logo they import from the site's assets —
    // actually moved.
    render: {
      command: [
        "remotion render Demo out/demo.mp4 --crf=28",
        "remotion still Poster out/demo-poster.png",
      ],
      input: [
        "src/**",
        "package.json",
        "remotion.config.ts",
        { pattern: "assets/logo.png", base: "workspace" },
      ],
      output: ["out/demo.mp4", "out/demo-poster.png"],
    },

    // The GIF is for buildcage/docker's README, not this site, so it never
    // enters the page build — it lands in assets/ purely as a staging spot to
    // upload from. Named for its destination repository, since isolated-run
    // will want its own cut.
    "render:gif": {
      command:
        "remotion render DemoShort ../assets/demo-docker.gif --codec=gif --scale=0.5 --every-nth-frame=2",
      input: [
        "src/**",
        "package.json",
        "remotion.config.ts",
        { pattern: "assets/logo.png", base: "workspace" },
      ],
      output: [{ pattern: "assets/demo-docker.gif", base: "workspace" }],
    },
    },
  },
});
