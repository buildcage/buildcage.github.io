#!/usr/bin/env bash
#
# Builds the site into /out/dist inside the pinned container. The repo is mounted
# read-only at /src and copied out (minus node_modules and other build products) so
# a host checkout's platform-specific node_modules never leaks into the Linux build.
set -euo pipefail

echo "==> staging source into /site"
mkdir -p /site
tar -C /src \
    --exclude=node_modules \
    --exclude=demo/node_modules \
    --exclude=.git \
    --exclude=dist \
    --exclude=demo/out \
    -cf - . | tar -C /site -xf -

cd /site
echo "==> pnpm install"
corepack pnpm install --frozen-lockfile

echo "==> vp run build (render -> stage:demo -> build)"
vp run build

echo "==> exporting dist to /out/dist"
mkdir -p /out
rm -rf /out/dist
cp -r /site/dist /out/dist
ls -la /out/dist | head
echo "==> done"
