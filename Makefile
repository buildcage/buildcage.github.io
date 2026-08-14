PORT ?= 8765

.PHONY: help
help:
	@grep -E '^[a-zA-Z_0-9-]+(-%)?:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# The site is plain files with no build step, so this just serves the directory
# as GitHub Pages does. Override the port with `make serve PORT=8080`.
.PHONY: serve
serve: ## Serve the site locally (PORT defaults to 8765)
	@echo "http://localhost:$(PORT)"
	@python3 -m http.server $(PORT) --directory .
