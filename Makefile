PORT ?= 8765

# The release tag the page's <video> points at. Bump this and the URL in
# index.html together — the tag is pinned so each page version names one exact
# cut of the video, and so a new upload can never be served from a stale cache.
DEMO_TAG ?= demo-v1

.PHONY: help
help:
	@grep -E '^[a-zA-Z_0-9-]+(-%)?:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-14s\033[0m %s\n", $$1, $$2}'

# The page itself is plain files with no build step, so this just serves the
# directory as GitHub Pages does. Override the port with `make serve PORT=8080`.
.PHONY: serve
serve: ## Serve the site locally (PORT defaults to 8765)
	@echo "http://localhost:$(PORT)"
	@python3 -m http.server $(PORT) --directory .

.PHONY: demo
demo: ## Render the video and poster into demo/out/ (gitignored)
	@cd demo && vp install && vp run render

.PHONY: demo-gif
demo-gif: ## Render the README GIF into demo/out/ (uploaded to the action repos by hand)
	@cd demo && vp install && vp run render:gif

# The poster is small enough to live in the repo and has to be in the first
# paint anyway; the video is the part kept out of the history.
.PHONY: demo-publish
demo-publish: ## Copy the rendered poster into assets/, ready to commit
	@test -f demo/out/demo-poster.png || { echo "demo/out/demo-poster.png missing — run 'make demo' first"; exit 1; }
	@cp demo/out/demo-poster.png assets/demo-poster.png
	@echo "Poster published to assets/ — review, then commit."

.PHONY: demo-release
demo-release: ## Upload the rendered video to the $(DEMO_TAG) release (publishes publicly)
	@test -f demo/out/demo.mp4 || { echo "demo/out/demo.mp4 missing — run 'make demo' first"; exit 1; }
	@grep -q "$(DEMO_TAG)/demo.mp4" index.html || { echo "index.html doesn't point at $(DEMO_TAG) — update the <source> URL first"; exit 1; }
	@gh release view $(DEMO_TAG) >/dev/null 2>&1 \
		|| gh release create $(DEMO_TAG) --title "Demo video $(DEMO_TAG)" --notes "Hosting for the walkthrough embedded on buildcage.github.io."
	@gh release upload $(DEMO_TAG) demo/out/demo.mp4 --clobber
	@echo "Uploaded. The page will serve it from the $(DEMO_TAG) release."
