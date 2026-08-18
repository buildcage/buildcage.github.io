import { defineConfig, type Plugin } from "vite-plus";

const SITE = "https://buildcage.github.io";

/**
 * Describes the hero video to search engines, which is the one thing on this
 * page eligible for a rich result.
 *
 * Injected at build time rather than written into index.html because the video
 * and its poster are content-hashed: their names change whenever the video is
 * re-rendered, and a hand-written URL would be stale from the first re-render.
 * The names are read back out of the transformed HTML, so they can only be the
 * ones actually shipped.
 */
const videoObject = (): Plugin => ({
  name: "buildcage-video-object",
  transformIndexHtml: {
    order: "post",
    handler(_html, ctx) {
      // The emitted names, not the ones in the markup: at this point the markup
      // still holds Vite's placeholders, which are resolved to hashed names
      // later. In dev there is no bundle and the files are served unhashed.
      const emitted = Object.keys(ctx.bundle ?? {});
      const find = (pattern: RegExp, fallback: string) =>
        emitted.find((name) => pattern.test(name)) ?? fallback;
      const contentUrl = find(/^assets\/demo-wide-[A-Za-z0-9_-]+\.mp4$/, "assets/demo-wide.mp4");
      const thumbnailUrl = find(
        /^assets\/demo-wide-poster-[A-Za-z0-9_-]+\.png$/,
        "assets/demo-wide-poster.png",
      );

      const data = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: "Adding Buildcage to a GitHub Actions workflow",
        description:
          "Adding Buildcage to a workflow, end to end: three steps, one audit run, and the allowlist it writes for you.",
        // First published; re-renders change the encoding, not the recording.
        uploadDate: "2026-08-17T20:11:25+09:00",
        duration: "PT37S",
        contentUrl: `${SITE}/${contentUrl}`,
        thumbnailUrl: `${SITE}/${thumbnailUrl}`,
      };

      return [
        {
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: JSON.stringify(data, null, 2),
          injectTo: "head",
        },
      ];
    },
  },
});

export default defineConfig({
  plugins: [videoObject()],

  // The site is a single hand-authored page; Vite is here for one reason —
  // content-hashed filenames. GitHub Pages serves everything with
  // `cache-control: max-age=600` and gives no way to change that, so a file
  // that keeps its name can be served stale after a deploy. Hashing makes new
  // content a new URL, which sidesteps the cache entirely.
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // The page is 20 KB of hand-written markup with meaningful indentation in
    // its <pre> blocks; minifying it buys nothing and makes the deployed
    // source unreadable.
    minify: "esbuild",
    assetsInlineLimit: 0,
  },

  // Copied verbatim, no hashing. `assets/banner.png` is referenced by og:image
  // as an absolute URL, so social crawlers need it to stay exactly where it is
  // — a hashed name would 404. `.nojekyll` has to reach the deployed root too.
  publicDir: "public",

  // Ignore patterns are resolved against the workspace, not the package you
  // happen to run from, so listing `demo/**` here silently disabled linting
  // and formatting inside demo/ as well — including when run from there. Only
  // generated output is excluded now; demo/ carries its own vite.config.ts for
  // anything specific to it.
  lint: {
    ignorePatterns: ["dist/**", "demo/out/**"],
  },
  fmt: {
    ignorePatterns: ["dist/**", "demo/out/**", "assets/**"],
  },
  staged: {
    "*.{ts,js,json,jsonc,md,css,html}": "vp check --fix",
  },

  run: {
    tasks: {
      // Pulls the rendered video and poster out of demo/ and into the tree Vite
      // builds from. Both are gitignored here — main never carries them.
      "stage:demo": {
        command: [
          "cp demo/out/demo-wide.mp4 assets/demo-wide.mp4",
          "cp demo/out/demo-wide-poster.png assets/demo-wide-poster.png",
          "cp demo/out/demo-narrow.mp4 assets/demo-narrow.mp4",
          "cp demo/out/demo-narrow-poster.png assets/demo-narrow-poster.png",
        ],
        dependsOn: ["buildcage-demo#render"],
        input: [
          "demo/out/demo-wide.mp4",
          "demo/out/demo-wide-poster.png",
          "demo/out/demo-narrow.mp4",
          "demo/out/demo-narrow-poster.png",
        ],
        output: [
          "assets/demo-wide.mp4",
          "assets/demo-wide-poster.png",
          "assets/demo-narrow.mp4",
          "assets/demo-narrow-poster.png",
        ],
      },

      build: {
        command: "vite build",
        dependsOn: ["stage:demo"],
      },

      // Replaces the publish branch with a single parentless commit of dist/.
      publish: {
        command: "./scripts/publish.sh",
        dependsOn: ["build"],
        cache: false,
      },
    },
  },
});
