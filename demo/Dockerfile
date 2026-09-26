# syntax=docker/dockerfile:1
# Pinned Linux env for building the site, so the Remotion render is reproducible
# (fixed Debian fonts/Chrome instead of the runner's). Off macOS, emoji become Noto.
FROM node:24-bookworm-slim@sha256:0e0ff40c39bc087845bfb27465a0df4ea419520094bc35842ff83dd8cbe6f9b6

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

COPY build-site.sh /usr/local/bin/build-site.sh
RUN chmod +x /usr/local/bin/build-site.sh

ENTRYPOINT ["/usr/local/bin/build-site.sh"]
