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
      // Both cuts, every time: the page carries the pair and picks between
      // them at runtime, so shipping one without the other would leave half
      // the visitors on a stale video.
      command: [
        "remotion render Demo out/demo-wide.mp4 --crf=28",
        "remotion still Poster out/demo-wide-poster.png",
        "remotion render DemoNarrow out/demo-narrow.mp4 --crf=28",
        "remotion still PosterNarrow out/demo-narrow-poster.png",
      ],
      input: [
        "src/**",
        "package.json",
        "remotion.config.ts",
        { pattern: "assets/logo.png", base: "workspace" },
      ],
      output: [
        "out/demo-wide.mp4",
        "out/demo-wide-poster.png",
        "out/demo-narrow.mp4",
        "out/demo-narrow-poster.png",
      ],
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

    // The same walkthrough for buildcage/isolated-run, whose action is
    // self-contained — one step to wrap, no builder to point at. GIF only:
    // its README is the only place this cut is used.
    "render:gif:isolated-run": {
      command:
        "remotion render IsolatedRunShort ../assets/demo-isolated-run.gif --codec=gif --scale=0.5 --every-nth-frame=2",
      input: [
        "src/**",
        "package.json",
        "remotion.config.ts",
        { pattern: "assets/logo.png", base: "workspace" },
      ],
      output: [{ pattern: "assets/demo-isolated-run.gif", base: "workspace" }],
    },
    },
  },
});
