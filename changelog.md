# webpack-watch-server change log

## Next

### Major

- Updated the supported Node.js versions to `^10.17.0 || ^12.0.0 || >= 13.7.0`.
- Updated dependencies, some of which require newer Node.js versions than were previously supported.

### Patch

- Removed the [`husky`](https://npm.im/husky) dev dependency and the `precommit` package script.
- New linting related config and package test scripts.
- Updated package metadata.
- Use strict mode for scripts.
- Added JSDoc to the source.
- Removed `package-lock.json` from `.gitignore` as it has been disabled via `.npmrc`.
- Changed the readme heading 1 to match the package name.
- Updated readme badges.
- Updated readme install section.
- Updated EditorConfig.

## 1.2.1

- Updated dependencies.
- Added a cool demo GIF to the readme.
- Corrected “npm” capitalization in the package description.

## 1.2.0

- Updated dependencies.
- Added a new `--config` CLI argument for a custom Webpack config file path, via [#1](https://github.com/jaydenseric/webpack-watch-server/pull/1).
- Improved console messages.
  - There is a persistent instruction for exiting.
  - Events such as the Webpack config loading, Webpack compiling and the server starting are logged.
  - Webpack compiles and server starts are numbered.

## 1.1.0

- Removed the redundant `fined` dependency.
- Improved logging.
  - Console clears each server start.
  - More compact with less whitespace.
  - Log color changed from white to default, improving legibility in consoles with white backgrounds.
  - Removed Webpack build info; no one cares in dev mode.

## 1.1.0-alpha.1

- Updated dependencies.
- Support `webpack@3`.
- Dropped Yarn in favor of `npm@5`. Removed `yarn.lock` and updated install instructions.
- Readme tweaks including a new licence badge.
- New ESLint config. Dropped [Standard Style](https://standardjs.com) and began using [Prettier](https://github.com/prettier/eslint-plugin-prettier).
- Using [Husky](https://github.com/typicode/husky) to ensure commits are free of lint errors.
- Exits more elegantly on errors.
- Added a change log.

## 1.0.0

- Initial release.
