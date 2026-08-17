import { defineConfig } from "vite-plus";

export default defineConfig({
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

  lint: {
    ignorePatterns: ["dist/**", "demo/**"],
  },
  fmt: {
    ignorePatterns: ["dist/**", "demo/**", "assets/**"],
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
          "cp demo/out/demo.mp4 assets/demo.mp4",
          "cp demo/out/demo-poster.png assets/demo-poster.png",
        ],
        dependsOn: ["buildcage-demo#render"],
        input: ["demo/out/demo.mp4", "demo/out/demo-poster.png"],
        output: ["assets/demo.mp4", "assets/demo-poster.png"],
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
