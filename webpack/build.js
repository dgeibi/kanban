const path = require('path')
const commandLineArgs = require('command-line-args')
const runWebpack = require('./utils/runWebpack')
const ConfigBuilder = require('./utils/ConfigBuilder')

const options = commandLineArgs([
  { name: 'dist', alias: 'd', type: String, defaultValue: './dist' },
  { name: 'serve', alias: 's', type: Boolean, defaultValue: false },
  { name: 'mode', type: String, defaultValue: 'development' },
])

const serverConfig = new ConfigBuilder(require('./server/opts')).toConfigSync()
const clientConfig = new ConfigBuilder(require('./client/opts')).toConfigSync()

const config = [serverConfig, clientConfig]

const outputPath = path.resolve(options.dist)

const build = () => {
  const rimraf = require('rimraf')
  console.log(`rm -rf ${outputPath}`)
  rimraf.sync(outputPath)

  return runWebpack(config).then(stats => {
    console.log(
      stats.toString({
        chunks: false,
        colors: true,
      })
    )
    if (stats.hasErrors()) throw Error('webpack build has errors')
  })
}

const serve = () => {
  const execa = require('execa')
  return execa('node', ['./dist/server.js'], {
    stdio: 'inherit',
  })
}

build()
  .then(() => options.serve && serve())
  .catch(error => {
    console.error(error)
  })
