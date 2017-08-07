#!/usr/bin/env node

// eslint-disable-next-line node/no-missing-require
const webpack = require('webpack')
const minimist = require('minimist')
const Liftoff = require('liftoff')
const chalk = require('chalk')
const { spawn } = require('child_process')

const args = minimist(process.argv.slice(2))

const WebpackWatchServer = new Liftoff({
  name: 'webpack-watch-server',
  configName: 'webpack',
  extensions: {
    '.config.babel.js': 'babel-register',
    '.config.js': null,
    'file.js': null
  }
})

function invoke(env) {
  if (!env.configPath) {
    process.stdout.write(chalk.red('Webpack config file not found.'))
    process.exitCode = 1
    return
  }

  // Import webpack config
  let webpackConfig = require(env.configPath)

  // Normalize default export
  if (
    typeof webpackConfig === 'object' &&
    typeof webpackConfig.default === 'object'
  )
    webpackConfig = webpackConfig.default

  try {
    var outputPath = webpackConfig.output.path
  } catch (error) {
    process.stdout.write(
      chalk.red(
        'Webpack config file must export an object containing ‘output.path’.'
      )
    )
    process.exitCode = 1
    return
  }

  let serverProcess

  function startServer() {
    serverProcess = spawn('node', [outputPath])
    serverProcess.stdout.on('data', data => process.stdout.write(data))
    serverProcess.stderr.on('data', data =>
      process.stdout.write(chalk.red(data))
    )
  }

  function stopServer() {
    if (serverProcess) serverProcess.kill()
  }

  const compiler = webpack(webpackConfig)
  const watcher = compiler.watch({}, (errors, stats) => {
    stopServer()
    // Clear the console
    process.stdout.write('\x1Bc')
    if (errors || stats.hasErrors())
      process.stdout.write(stats.toString('errors-only') + '\n')
    else startServer()
  })

  function exit() {
    watcher.close()
    stopServer()
  }

  ;[
    'SIGINT',
    'SIGTERM',
    'SIGHUP',
    'SIGQUIT',
    'exit',
    'uncaughtException'
  ].forEach(event => process.on(event, exit))
}

WebpackWatchServer.launch({ configPath: args.config }, invoke)
