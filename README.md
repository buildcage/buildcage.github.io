# buildcage.github.io

The landing page for the [Buildcage](https://github.com/buildcage) organization, served at
**<https://buildcage.github.io/>**.

Plain HTML and CSS — no build step and no JavaScript. GitHub Pages serves this directory as it is,
from `main`.

## Local preview

```sh
make serve          # http://localhost:8765
make serve PORT=8080
```

## Editing notes

- The `uses:` examples in `index.html` are pinned to commit SHAs and kept current by Renovate. They
  are syntax-highlighted with token elements, and `renovate.json`'s custom manager is written to
  skip over those tags — if you restructure a code block, check that it still matches.
- `assets/logo.png` is the lockup with its background as alpha, which is what lets the hero choose
  its own colour. `assets/banner.png` keeps the original flat background and is used for the social
  card.
- The comparison section was written from the other projects' own docs and agent source. Re-verify
  before changing any claim there.
