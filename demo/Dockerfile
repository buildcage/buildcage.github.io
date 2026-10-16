# syntax=docker/dockerfile:1
# Pinned Linux env for building the site, so the Remotion render is reproducible
# (fixed Debian fonts/Chrome instead of the runner's). Off macOS, emoji become Noto.
# Build from the repo root: `docker buildx build -f demo/Dockerfile -o dist .`
FROM node:24-bookworm-slim@sha256:eae779f20e0cdf264247f6f3b4e62510d91f168a615117ed38430ba295f55590 AS build

# Chrome Headless Shell libs + fonts; fonts-noto-color-emoji keeps ✅/🚫 in colour.
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates curl git tar \
      libnss3 libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
      libdrm2 libgbm1 libasound2 libpango-1.0-0 libcairo2 libxkbcommon0 \
      libx11-6 libxcomposite1 libxdamage1 libxext6 libxfixes3 libxrandr2 \
      libxcb1 libxrender1 libxi6 libxtst6 \
      fonts-liberation fonts-noto-core fonts-noto-color-emoji \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://vite.plus | bash
ENV PATH="/root/.local/share/vite-plus/bin:${PATH}"

WORKDIR /site
COPY . .
RUN vp install --frozen-lockfile
RUN vp run build

FROM scratch
COPY --from=build /site/dist/ /
