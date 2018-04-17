const ConfigBuilder = require('~/../webpack/utils/ConfigBuilder')

const config = new ConfigBuilder({
  ...require('~/../webpack/client/opts'),
  hot: true,
}).toConfigSync()

config.entry.unshift(
  'webpack-hot-middleware/client?reload=true&dynamicPublicPath=true'
)

module.exports = config
