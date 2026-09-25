# syntax=docker/dockerfile:1
#
# Pinned Linux environment for building the landing site, including the Remotion
# render of the demo video. Used by .github/workflows/deploy.yml so the published
# video renders the same way every time: the same Debian fonts (Noto, incl. colour
# emoji) and the same Chrome Headless Shell, rather than whatever the GitHub runner
# image happens to ship. Building the site off macOS swaps Apple's emoji for Noto's;
# everything else (Google-fonts text, layout) is unchanged.
FROM node:24-bookworm-slim

# Chrome Headless Shell runtime libraries + fonts. fonts-noto-color-emoji is what
# renders the report card's ✅/🚫 in colour instead of tofu.
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates curl git tar \
      libnss3 libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
      libdrm2 libgbm1 libasound2 libpango-1.0-0 libcairo2 libxkbcommon0 \
      libx11-6 libxcomposite1 libxdamage1 libxext6 libxfixes3 libxrandr2 \
      libxcb1 libxrender1 libxi6 libxtst6 \
      fonts-liberation fonts-noto-core fonts-noto-color-emoji \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable

# vp launcher on PATH; it delegates to the vite-plus devDependency pnpm installs.
RUN curl -fsSL https://vite.plus | bash
ENV PATH="/root/.local/share/vite-plus/bin:${PATH}"

COPY build-site.sh /usr/local/bin/build-site.sh
RUN chmod +x /usr/local/bin/build-site.sh

ENTRYPOINT ["/usr/local/bin/build-site.sh"]
