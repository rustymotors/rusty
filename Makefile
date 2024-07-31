test:
	pnpm exec nx affected -t lint test build

codecov_install:
	pip install codecov-cli

codecov: codecov_install
	codecovcli --verbose upload-process --fail-on-error -t $CODECOV_TOKEN -n Server -F Server -f apps/server/coverage/lcov.info
	codecovcli --verbose upload-process --fail-on-error -t $CODECOV_TOKEN -n Config -F Config -f libs/config/coverage/lcov.info
	codecovcli --verbose upload-process --fail-on-error -t $CODECOV_TOKEN -n Utils -F Utils -f libs/utils/coverage/lcov.info
	codecovcli --verbose upload-process --fail-on-error -t $CODECOV_TOKEN -n Web -F Web -f libs/web/coverage/lcov.info

codecov_local:
	codecovcli --verbose upload-process --fail-on-error -n Server -F Server -f apps/server/coverage/lcov.info
	codecovcli --verbose upload-process --fail-on-error -n Config -F Config -f libs/config/coverage/lcov.info
	codecovcli --verbose upload-process --fail-on-error -n Utils -F Utils -f libs/utils/coverage/lcov.info
	codecovcli --verbose upload-process --fail-on-error -n Web -F Web -f libs/web/coverage/lcov.info


@PHONY: test codecov_install codecov