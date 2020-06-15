#!/usr/bin/env node

'use strict';

const { spawn } = require('child_process');
const chalk = require('chalk');
const Liftoff = require('liftoff');
const minimist = require('minimist');
// eslint-disable-next-line node/no-missing-require
const webpack = require('webpack');

/**
 * Logs information to the console.
 * @kind function
 * @name logInfo
 * @param {string} info Information.
 * @ignore
 */
function logInfo(info) {
  process.stdout.write(chalk.green(`${info}\n`));
}

/**
 * Logs an error to the console.
 * @kind function
 * @name logError
 * @param {string} error Error.
 * @ignore
 */
function logError(error) {
  process.stdout.write(chalk.red(`${error}\n`));
}

/**
 * Clears the console.
 * @kind function
 * @name clearConsole
 * @ignore
 */
function clearConsole() {
  process.stdout.write('\u001Bc');
  logInfo('⌃C to exit.');
}

/**
 * Invokes the CLI.
 * @kind function
 * @name invoke
 * @param {object} env The CLI environment.
 * @ignore
 */
function invoke(env) {
  clearConsole();

  if (!env.configPath) {
    logError('Webpack config file not found.');
    process.exitCode = 1;
    return;
  }

  logInfo('Loading Webpack config…');
  let webpackConfig = require(env.configPath);

  if (
    typeof webpackConfig === 'object' &&
    typeof webpackConfig.default === 'object'
  )
    // Normalize default export.
    webpackConfig = webpackConfig.default;

  try {
    var outputPath = webpackConfig.output.path;
  } catch (error) {
    logError('Webpack config file must export an object with ‘output.path’.');
    process.exitCode = 1;
    return;
  }

  let webpackCompileCount = 0;
  let serverStartCount = 0;
  let serverProcess;

  /**
   * Starts the server.
   * @kind function
   * @name invoke~startServer
   * @ignore
   */
  function startServer() {
    serverStartCount++;
    clearConsole();
    logInfo(`Server start ${serverStartCount}…`);
    serverProcess = spawn('node', [outputPath]);
    serverProcess.stdout.on('data', (data) => process.stdout.write(data));
    serverProcess.stderr.on('data', logError);
  }

  /**
   * Stops the server.
   * @kind function
   * @name invoke~stopServer
   * @ignore
   */
  function stopServer() {
    if (serverProcess) serverProcess.kill();
  }

  const compiler = webpack(webpackConfig);

  compiler.plugin('compile', () => {
    webpackCompileCount++;
    clearConsole();
    logInfo(`Webpack compile ${webpackCompileCount}…`);
  });

  const watcher = compiler.watch({}, (errors, stats) => {
    stopServer();
    if (errors || stats.hasErrors())
      process.stdout.write(stats.toString('errors-only') + '\n');
    else startServer();
  });

  /**
   * Exits the CLI process.
   * @kind function
   * @name invoke~exit
   * @ignore
   */
  function exit() {
    watcher.close();
    stopServer();
  }

  [
    'SIGINT',
    'SIGTERM',
    'SIGHUP',
    'SIGQUIT',
    'exit',
    'uncaughtException',
  ].forEach((event) => process.on(event, exit));
}

const args = minimist(process.argv.slice(2));
const WebpackWatchServer = new Liftoff({
  name: 'webpack-watch-server',
  configName: 'webpack',
  extensions: {
    '.config.babel.js': 'babel-register',
    '.config.js': null,
    'file.js': null,
  },
});

WebpackWatchServer.launch({ configPath: args.config }, invoke);
