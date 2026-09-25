#!/usr/bin/env bash
# Builds the site into /out/dist inside the container. Repo is mounted at /src:ro
# and copied out (minus node_modules) so a host checkout's binaries never leak in.
set -euo pipefail

mkdir -p /site
tar -C /src \
    --exclude=node_modules \
    --exclude=demo/node_modules \
    --exclude=.git \
    --exclude=dist \
    --exclude=demo/out \
    -cf - . | tar -C /site -xf -

cd /site
vp install --frozen-lockfile
vp run build

mkdir -p /out
rm -rf /out/dist
cp -r /site/dist /out/dist
ls -la /out/dist | head
