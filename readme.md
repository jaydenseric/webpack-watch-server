# webpack-watch-server

[![npm version](https://badgen.net/npm/v/webpack-watch-server)](https://npm.im/webpack-watch-server) [![CI status](https://github.com/jaydenseric/webpack-watch-server/workflows/CI/badge.svg)](https://github.com/jaydenseric/webpack-watch-server/actions)

A single `webpack-watch-server` command to add to your package scripts that fires up [Webpack](https://webpack.js.org) in watch mode and restarts your server each build. Webpack and server logs stream in a unified console with clear formatting and pretty colors.

By using a Webpack build callback under the hood, this package is much more efficient than using a seperate watcher (such as [Nodemon](https://nodemon.io) or [Forever](https://github.com/foreverjs/forever)) to restart the server.

<img src="demo.gif" width="500" alt="webpack-watch-server demo" />

## Setup

To install from [npm](https://www.npmjs.com/get-npm) run:

```sh
npm install webpack-watch-server --save-dev
```

## Usage

1. Add `"dev": "webpack-watch-server"` to your `package.json` scripts. To specify a custom Webpack config file path use `webpack-watch-server --config path/to/custom-webpack-config.js`. The file will be transpiled with Babel if it’s name ends with `.config.babel.js`.
2. Run `npm run dev` to start Webpack in watch mode. The server automatically starts and restarts after each build.

## Caveats

- It is assumed your server file is the default Node finds at the Webpack config `output.path` – `index.js` works.
- For now, only plain object Webpack configs are supported.

## Support

- Node.js `^10.17.0 || ^12.0.0 || >= 13.7.0`.
