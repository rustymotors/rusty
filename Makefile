test:
	./scripts/inject-token.sh
	pnpm exec nx affected -t lint build test

@PHONY: test