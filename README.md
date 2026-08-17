# buildcage.github.io

The landing page for the [Buildcage](https://github.com/buildcage) organization, served at
**<https://buildcage.github.io/>**.

The page is plain HTML and CSS, with a few lines of inline JavaScript for the click-to-play video.
GitHub Pages serves this directory as it is, from `main` — pushing to `main` is the deploy.

The hero video is the one generated part of the site; everything else is authored by hand. It comes
from the Remotion project in [`demo/`](#demo-video), and is **not** committed — at ~2.4 MB per cut,
every version would sit in the git history for good. It's uploaded as a release asset instead and
linked by URL, which is why `assets/demo.mp4` is gitignored. The poster frame
(`assets/demo-poster.png`) *is* committed: it's ~170 KB and has to be there for the first paint.

## Local preview

```sh
make serve          # http://localhost:8765
make serve PORT=8080
```

## Demo video

[`demo/`](demo) is a [Remotion](https://www.remotion.dev/) project that renders the walkthrough
embedded in the hero. Edit the source there rather than the video — the point of it being code is
that a wording, colour, or timing change is a re-render, not a re-recording.

```sh
cd demo && vp run dev   # Remotion Studio, for iterating on scenes
make demo               # render the video + poster into demo/out/
make demo-publish       # copy the poster into assets/, ready to commit
make demo-release       # upload the video to the release the page points at
make demo-gif           # render the README GIF into demo/out/
```

`demo/out/` is gitignored, so re-rendering while you tune something costs nothing.

### Releasing a new cut of the video

The `<source>` URL in `index.html` pins a release tag, so a given version of the page always names
one exact cut of the video and a new upload can never be served from a stale cache. To ship a new
one:

1. Bump `DEMO_TAG` in the `Makefile` and the matching tag in `index.html`'s `<source>` URL.
2. `make demo` — render it.
3. `make demo-release` — creates the release if needed and uploads the file. It refuses to run if
   `index.html` doesn't already point at the tag, so the two can't drift.
4. `make demo-publish`, then commit the poster and the HTML change.

`make demo-gif` stays separate because the GIF is for the two action repos' READMEs, not this site
— upload it there by hand.

Note that Remotion is free for individuals, non-profits, and for-profit organisations with three
employees or fewer; larger organisations need a company licence. The rendered files themselves
carry no such restriction.

### What lives where

| Path | Purpose |
| --- | --- |
| `demo/src/content/workflow-steps.ts` | The YAML shown on screen, and each step's heading — the file to edit for wording |
| `demo/src/content/report-data.ts` | Hosts, rules, and counts in the Job Summary cards |
| `demo/src/theme.ts` | Colours and fonts, mirroring `style.css` |
| `demo/src/Main.tsx` | Scene order and durations |

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
