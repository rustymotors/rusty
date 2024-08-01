test:
	pnpm exec nx affected -t lint test build

test_all:
	pnpm exec nx run-many --target=test --all

codecov_install:
	pip install codecov-cli

codecov: codecov_install
	codecovcli --verbose upload-process --fail-on-error -n Server -F Server -f apps/server/coverage/lcov.info
	codecovcli --verbose upload-process --fail-on-error -n Config -F Config -f libs/config/coverage/lcov.info
	codecovcli --verbose upload-process --fail-on-error -n Utils -F Utils -f libs/utils/coverage/lcov.info
	codecovcli --verbose upload-process --fail-on-error -n Web -F Web -f libs/web/coverage/lcov.info

codecov_local:
	codecovcli --verbose upload-process --fail-on-error -n Server -F Server -f apps/server/coverage/lcov.info
	codecovcli --verbose upload-process --fail-on-error -n Config -F Config -f libs/config/coverage/lcov.info
	codecovcli --verbose upload-process --fail-on-error -n Utils -F Utils -f libs/utils/coverage/lcov.info
	codecovcli --verbose upload-process --fail-on-error -n Web -F Web -f libs/web/coverage/lcov.info


@PHONY: test codecov_install codecov