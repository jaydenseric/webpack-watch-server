#!/usr/bin/env node

// eslint-disable-next-line node/no-missing-require
const webpack = require('webpack')
const Liftoff = require('liftoff')
const indentString = require('indent-string')
const chalk = require('chalk')
const { spawn } = require('child_process')

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
    console.error(chalk.red('Webpack config file not found.'))
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
    console.error(
      chalk.red(
        'Webpack config file export must include ‘output.path’. Note only a plain object config is supported.'
      )
    )
    process.exitCode = 1
    return
  }

  let serverProcess
  let wasServerMessage

  function startServer() {
    serverProcess = spawn('node', [outputPath])
    serverProcess.stdout.on('data', data => {
      console.log(
        (wasServerMessage ? '' : '\n') + indentString(chalk.white(data), 4)
      )
      wasServerMessage = true
    })
    serverProcess.stderr.on('data', data => {
      console.error(
        (wasServerMessage ? '' : '\n') + indentString(chalk.red(data), 4)
      )
      wasServerMessage = true
    })
  }

  function stopServer() {
    if (serverProcess) serverProcess.kill()
  }

  const compiler = webpack(webpackConfig)
  const watcher = compiler.watch({}, (errors, stats) => {
    const hasErrors = errors || stats.hasErrors()
    console[hasErrors ? 'error' : 'log'](stats.toString('minimal'))
    wasServerMessage = false
    stopServer()
    if (!hasErrors) startServer()
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

WebpackWatchServer.launch({}, invoke)
