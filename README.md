# buildcage.github.io

The landing page for the [Buildcage](https://github.com/buildcage) organization, served at
**<https://buildcage.github.io/>**.

The page is plain HTML and CSS, with a few lines of inline JavaScript for the click-to-play video.

## Branches

| Branch | Contents |
| --- | --- |
| `main` | Source. Authored files only — no rendered video or poster |
| `publish` | What Pages serves: the site files plus the rendered assets |

The hero video is the one generated part of the site, rendered from the Remotion project in
[`demo/`](#demo-video). At ~2.4 MB per cut it stays out of `main` entirely — otherwise every version
would sit in the history for good. `publish` is rebuilt as a single parentless commit each time, so
it doesn't accumulate them either.

Nothing is lost by `publish` having no history: it's reproducible from `main`, and each commit
message records the source commit it was built from. To roll the site back, check out the older
`main`, re-render, and publish again.

> Pages is configured to deploy from the `publish` branch. Pushing to `main` does **not** deploy.

## Local preview

```sh
make demo-stage     # put the rendered video and poster in assets/ (gitignored)
make serve          # http://localhost:8765
make serve PORT=8080
```

Without `make demo-stage` the page renders fine but the video won't load — the file isn't on `main`.

## Publishing

```sh
make demo           # render the video + poster into demo/out/
make demo-stage     # copy them into assets/
make publish        # rebuild the publish branch from HEAD + those assets
git push --force origin publish
```

`make publish` refuses to run with uncommitted changes, so the recorded source commit always
describes what was actually published. It only writes the local branch; pushing is deliberate and
separate.

Re-rendering isn't needed for a text-only change — `make demo-stage && make publish` is enough once
the files exist in `demo/out/`.

## Demo video

[`demo/`](demo) is a [Remotion](https://www.remotion.dev/) project that renders the walkthrough
embedded in the hero. Edit the source there rather than the video — the point of it being code is
that a wording, colour, or timing change is a re-render, not a re-recording.

```sh
cd demo && vp run dev   # Remotion Studio, for iterating on scenes
make demo               # render the video + poster into demo/out/
make demo-gif           # render the README GIF into demo/out/
```

`demo/out/` is gitignored, so re-rendering while you tune something costs nothing. `make demo-gif`
is separate because the GIF is for the two action repos' READMEs, not this site — upload it there by
hand.

Note that Remotion is free for individuals, non-profits, and for-profit organisations with three
employees or fewer; larger organisations need a company licence. The rendered files themselves carry
no such restriction.

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
