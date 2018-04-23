const commandLineArgs = require('command-line-args')
const fse = require('fs-extra')

const options = commandLineArgs([
  { name: 'command', defaultOption: true, defaultValue: 'dev' },
  { name: 'serve', alias: 's', type: Boolean, defaultValue: false },
  { name: 'env', type: String, defaultValue: 'development' },
])

const clean = () => fse.removeSync('./dist')

switch (options.command) {
  case 'dev':
    clean()
    require('./dev')(options)
    break
  case 'build':
    clean()
    require('./build')(options)
    break
  default:
    throw Error(`illegal command ${options.command}`)
}
