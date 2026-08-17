#!/usr/bin/env bash
#
# Builds the `publish` branch: the files GitHub Pages actually serves, plus the
# rendered video and poster that main deliberately doesn't carry.
#
# Every run replaces the branch with a single parentless commit, so the ~2.4 MB
# video never accumulates in history. Nothing is lost by that — publish is
# reproducible from main, and the commit message records which source commit it
# was built from.
#
# This only writes the local branch. Pushing it is a separate, deliberate step.

set -euo pipefail

cd "$(dirname "$0")/.."

BRANCH=publish

# The served site. Everything else at the root (demo/, Makefile, README.md,
# renovate.json) is source or tooling and has no business being published.
SITE_FILES=(index.html style.css .nojekyll assets)

GENERATED=(assets/demo.mp4 assets/demo-poster.png)

for f in "${GENERATED[@]}"; do
  if [ ! -f "$f" ]; then
    echo "error: $f is missing — run 'make demo && make demo-stage' first" >&2
    exit 1
  fi
done

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "error: commit or stash your changes first — publish records the source commit it was built from" >&2
  exit 1
fi

source_commit=$(git rev-parse --short HEAD)
source_branch=$(git rev-parse --abbrev-ref HEAD)

# A scratch index, so the real one and the working tree are untouched.
tmp_index=$(mktemp -u "${TMPDIR:-/tmp}/buildcage-publish-XXXXXX")
export GIT_INDEX_FILE="$tmp_index"
trap 'rm -f "$tmp_index"' EXIT

# --force: the rendered files are gitignored on main, which is the point.
git add --force -- "${SITE_FILES[@]}"

tree=$(git write-tree)

# -S explicitly: the repository requires verified signatures, and commit-tree
# ignores commit.gpgsign (that setting only applies to `git commit`).
commit=$(git commit-tree -S "$tree" -m "Publish site from ${source_branch} ${source_commit}")

git update-ref "refs/heads/${BRANCH}" "$commit"

echo "Built ${BRANCH} at $(git rev-parse --short "$commit") from ${source_branch} ${source_commit}"
echo
git ls-tree -r --name-only "$commit" | sed 's/^/  /'
echo
echo "Publish with:  git push --force origin ${BRANCH}"
