const webpack = require('webpack')
const execa = require('execa')

const ConfigBuilder = require('./utils/ConfigBuilder')

const config = new ConfigBuilder({
  ...require('./server/opts'),
  hot: true,
}).toConfigSync()

let running = false
const exec = () => {
  running = true
  execa('node', ['./dist/server.js'], {
    stdio: 'inherit',
  }).on('exit', () => {
    running = false
  })
}

config.entry.unshift('webpack/hot/poll.js?1000')

const compiler = webpack(config)
compiler.watch(
  {
    aggregateTimeout: 300,
    poll: 1000,
  },
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
