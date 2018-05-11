const runWebpack = require('./utils/runWebpack')

module.exports = options => {
  process.env.NODE_ENV = options.env
  const serverConfig = require('./server')({
    NODE_ENV: options.env,
  }).toConfigSync()
  const clientConfig = require('./client')({
    NODE_ENV: options.env,
  }).toConfigSync()

  const build = () =>
    runWebpack([serverConfig, clientConfig]).then(stats => {
      console.log(
        stats.toString({
          chunks: false,
          colors: true,
        })
      )
      if (stats.hasErrors()) throw Error('webpack build has errors')
    })

  const serve = () => {
    const execa = require('execa')
    return execa('node', ['./dist/server.js'], {
      stdio: 'inherit',
    })
  }

  build()
    .then(() => options.serve && serve())
    .catch(error => {
      console.error(error.stack || error)
    })
}
