const webpack = require('webpack')
const execa = require('execa')

const Env = require('./Env')

Env.definitions['process.env.HOT_MODE'] = true

const config = require('./server.config')

const firstBuild = new Promise(resolve => {
  config.plugins.push(function notifyDone() {
    this.hooks.done.tap('my-done', resolve)
  })
})
config.plugins.push(new webpack.HotModuleReplacementPlugin())
config.entry.unshift('webpack/hot/poll.js?1000')

const compiler = webpack(config)

compiler.watch(
  {
    // Example watchOptions
    aggregateTimeout: 300,
    poll: 1000,
  },
  (err, stats) => {
    console.log(stats.toString({
      colors: true,
    }))
  }
)

firstBuild.then(() => {
  execa('node', ['./dist/server.js'], {
    stdio: 'inherit'
  })
})
