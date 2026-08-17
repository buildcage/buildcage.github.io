PORT ?= 8765

.PHONY: help
help:
	@grep -E '^[a-zA-Z_0-9-]+(-%)?:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-14s\033[0m %s\n", $$1, $$2}'

# Serves the working tree the way Pages serves the publish branch. Run
# `make demo-stage` first if you want the video to play locally.
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

# assets/demo.mp4 and assets/demo-poster.png are gitignored on main and only
# ever committed by the publish branch, so staging them is a local step.
.PHONY: demo-stage
demo-stage: ## Copy the rendered video and poster into assets/ (gitignored on main)
	@test -f demo/out/demo.mp4 || { echo "demo/out/demo.mp4 missing — run 'make demo' first"; exit 1; }
	@test -f demo/out/demo-poster.png || { echo "demo/out/demo-poster.png missing — run 'make demo' first"; exit 1; }
	@cp demo/out/demo.mp4 assets/demo.mp4
	@cp demo/out/demo-poster.png assets/demo-poster.png
	@echo "Staged into assets/ — 'make serve' will now play the video."

.PHONY: publish
publish: ## Rebuild the publish branch from the current source and staged assets
	@./scripts/publish.sh
