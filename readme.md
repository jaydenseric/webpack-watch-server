# Webpack watch server

![NPM version](https://img.shields.io/npm/v/webpack-watch-server.svg?style=flat-square) ![Github issues](https://img.shields.io/github/issues/jaydenseric/webpack-watch-server.svg?style=flat-square) ![Github stars](https://img.shields.io/github/stars/jaydenseric/webpack-watch-server.svg?style=flat-square)

A single `webpack-watch-server` command to add to your package scripts that fires up [Webpack](https://webpack.js.org) in watch mode and restarts your server each build. Webpack and server logs stream in a unified console with clear formatting and pretty colors.

By using a Webpack build callback under the hood, this package is much more efficient than using a seperate watcher (such as [Nodemon](https://nodemon.io) or [Forever](https://github.com/foreverjs/forever)) to restart the server.

- Node >= 6.4 supported.
- [MIT license](https://en.wikipedia.org/wiki/MIT_License).

## Install

run `npm install webpack-watch-server --save-dev` for [NPM](https://www.npmjs.com) or `yarn add webpack-watch-server --dev` for [Yarn](https://yarnpkg.com).

## Usage

Add `"dev": "webpack-watch-server"` to your package.json scripts.

Run `npm run dev` or `yarn run dev` to start Webpack in watch mode. The server automatically starts and restarts after each build.

## Caveats

- It is assumed your server file is the default Node finds at the Webpack config `output.path` – `index.js` works.
- For now, only plain object Webpack configs are supported.
