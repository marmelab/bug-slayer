.PHONY: build help

help: ## Show avaiable commmands
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## install dependencies
	npm install

start: ## Start the server
	npm start

build: ## Build production file
	npm run build

lint: ## Lint the code and fix autofixable errors
	npm run lint -- --fix

lint-ci: ## Lint the code, used for CI
	npm run lint

format: ## Format the code usign prettier
	npm run format
