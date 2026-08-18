# buildcage.github.io

The landing page for the [Buildcage](https://github.com/buildcage) organization, served at
**<https://buildcage.github.io/>**.

The page is plain HTML and CSS, with a few lines of inline JavaScript for the click-to-play video.

## Branches

| Branch    | Contents                                                   |
| --------- | ---------------------------------------------------------- |
| `main`    | Source. Authored files only — no rendered video or poster  |
| `publish` | What Pages serves: the site files plus the rendered assets |

The hero video is the one generated part of the site, rendered from the Remotion project in
[`demo/`](#demo-video). It ships as **two cuts** — 16:9 and 4:3 — and the stylesheet shows whichever
suits the screen: wide gets the widescreen cut, and below 900px the 4:3 one, which is taller at the
same width and so sets its type larger. Both are `preload="none"`, so the hidden one costs nothing.

At ~2.4 MB per cut they stay out of `main` entirely — otherwise every version would sit in the
history for good. `publish` is rebuilt as a single parentless commit each time, so it doesn't
accumulate them either.

Nothing is lost by `publish` having no history: it's reproducible from `main`, and each commit
message records the source commit it was built from. To roll the site back, check out the older
`main`, re-render, and publish again.

> Pages is configured to deploy from the `publish` branch. Pushing to `main` does **not** deploy.

## Commands

```sh
vp install          # once
vp dev              # dev server with HMR
vp run build        # render the video if stale, then build the page into dist/
vp preview          # serve dist/ as Pages will
vp run publish      # rebuild the publish branch from dist/
git push --force origin publish
```

`vp run build` is the real build: it depends on the video render, so a fresh clone produces the
whole site with one command. Plain `vp build` runs Vite alone and skips the render — use
`vp run build` unless you specifically want just the page.

The render is cached on `demo/src/**`, so it only actually runs when the video's source changed; a
text-only rebuild is near-instant.

`vp run publish` refuses to run with uncommitted changes, so the recorded source commit always
describes what was actually published. It only writes the local branch; pushing is deliberate and
separate.

### Why there's a build step

Pages serves everything with `cache-control: max-age=600` and offers no way to change that, so a
file that keeps its name can be served stale after a deploy — which is exactly what happened with
`style.css`. Vite gives every asset a content hash, so new content is a new URL and the cache stops
mattering.

Two things deliberately keep stable names, in `public/`:

- `assets/banner.png` — referenced by `og:image` as an absolute URL, so social crawlers need it to
  stay put. A hashed name would 404.
- `.nojekyll` — has to land at the deployed root.

`index.html` can't be hashed either, being the entry point. Its 10-minute cache window is the one
piece of staleness that remains.

## Demo video

[`demo/`](demo) is a [Remotion](https://www.remotion.dev/) project that renders the walkthrough
embedded in the hero. Edit the source there rather than the video — the point of it being code is
that a wording, colour, or timing change is a re-render, not a re-recording.

```sh
vp run buildcage-demo#dev         # Remotion Studio, for iterating on scenes
vp run buildcage-demo#render      # render the video + poster into demo/out/
vp run buildcage-demo#render:gif               # render assets/demo-docker.gif
vp run buildcage-demo#render:gif:isolated-run  # render assets/demo-isolated-run.gif
```

`demo/out/` is gitignored, so re-rendering while you tune something costs nothing.

The GIF tasks are separate from the build because those files are for the action repositories'
READMEs, not this site. Each writes into `assets/` — gitignored here, staged only so you have
something to upload by hand:

| Task                      | Output                         | Destination                                                         |
| ------------------------- | ------------------------------ | ------------------------------------------------------------------- |
| `render:gif`              | `assets/demo-docker.gif`       | [buildcage/docker](https://github.com/buildcage/docker)             |
| `render:gif:isolated-run` | `assets/demo-isolated-run.gif` | [buildcage/isolated-run](https://github.com/buildcage/isolated-run) |

The Docker and isolated-run walkthroughs share every scene downstream of the workflow edit — the
run, the report, the allowlist it generates. Only the YAML on screen and the step names differ, so
`demo/src/content/products.ts` is where a new variant would go. isolated-run has no full video:
its README is the only place that cut is used.

Note that Remotion is free for individuals, non-profits, and for-profit organisations with three
employees or fewer; larger organisations need a company licence. The rendered files themselves carry
no such restriction.

### What lives where

| Path                                     | Purpose                                                                |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| `demo/src/content/products.ts`           | Which cuts exist, and what each one shows                              |
| `demo/src/content/workflow-steps.ts`     | The Docker cut's YAML and step headings — the file to edit for wording |
| `demo/src/content/isolated-run-steps.ts` | The same for the isolated-run cut                                      |
| `demo/src/content/report-data.ts`        | Hosts, rules, and counts in the Job Summary cards                      |
| `demo/src/theme.ts`                      | Colours and fonts, mirroring `style.css`                               |
| `demo/src/Main.tsx`                      | Scene order and durations                                              |
| `demo/src/layout.ts`                     | How a scene arranges itself for the frame it's rendered into           |

## Editing notes

- The `uses:` examples in `index.html` are pinned to commit SHAs and kept current by Renovate. They
  are syntax-highlighted with token elements, and `renovate.json`'s custom manager is written to
  skip over those tags — if you restructure a code block, check that it still matches.
- The workflow shown in the video uses `@<sha>` placeholders instead of real SHAs, so Renovate has
  nothing to keep current there.
- `assets/logo.png` is the lockup with its background as alpha, which is what lets the hero choose
  its own colour. `assets/banner.png` keeps the original flat background and is used for the social
  card.
- The Job Summary cards in the video are a reproduction of the real report
  (`assets/report-*-mode.png`). Keep them faithful — don't add emphasis the real report doesn't
  have, or the video shows an interface nobody will get.
- The comparison section was written from the other projects' own docs and agent source. Re-verify
  before changing any claim there.
