const webpack = require('webpack')
const execa = require('execa')
const prependEntry = require('./prependEntry')

module.exports = () => {
  const config = require('./server')({ hot: true }).toConfigSync()

  let running = false
  const exec = () => {
    running = true
    execa('node', ['./dist/server.js'], {
      stdio: 'inherit',
    }).on('exit', () => {
      running = false
    })
  }
  config.entry = prependEntry(config.entry, 'webpack/hot/poll.js?1000')
  const compiler = webpack(config)
  compiler.watch(
    {
      aggregateTimeout: 300,
    },
    // multiple times
    (err, stats) => {
      console.log(
        stats.toString({
          colors: true,
        })
      )
      if (!running && !stats.hasErrors()) {
        exec()
      }
    }
  )
}
