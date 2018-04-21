const ConfigBuilder = require('~/../webpack/utils/ConfigBuilder')

module.exports = () =>
  new ConfigBuilder({
    ...require('~/../webpack/client/opts'),
    hot: true,
  }).toConfigSync()
