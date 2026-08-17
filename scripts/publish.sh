#!/usr/bin/env bash
#
# Replaces the `publish` branch with a single parentless commit of dist/ — the
# built site, with content-hashed filenames.
#
# No history on that branch is deliberate: dist/ carries a ~2.4 MB video, and
# keeping every build would grow the repository for good. Nothing is lost by
# it, since publish is reproducible from main and each commit message records
# the source commit it came from.
#
# This only writes the local branch. Pushing it is a separate, deliberate step.

set -euo pipefail

cd "$(dirname "$0")/.."

BRANCH=publish

if [ ! -f dist/index.html ]; then
  echo "error: dist/index.html is missing — run 'vp run build' first" >&2
  exit 1
fi

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

# --force because dist/ is gitignored on main. Writing the tree with a prefix
# lifts dist/'s contents to the root of the branch, so the built files land
# where Pages expects them rather than nested under dist/.
git add --force -- dist
dist_tree=$(git write-tree --prefix=dist)

# -S explicitly: the repository requires verified signatures, and commit-tree
# ignores commit.gpgsign (that setting only applies to `git commit`).
commit=$(git commit-tree -S "$dist_tree" -m "Publish site from ${source_branch} ${source_commit}")

git update-ref "refs/heads/${BRANCH}" "$commit"

echo "Built ${BRANCH} at $(git rev-parse --short "$commit") from ${source_branch} ${source_commit}"
echo
git ls-tree -r --name-only "$commit" | sed 's/^/  /'
echo
echo "Publish with:  git push --force origin ${BRANCH}"
