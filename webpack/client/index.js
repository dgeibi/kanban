const ConfigBuilder = require('../utils/ConfigBuilder')

module.exports = opts =>
  new ConfigBuilder({
    server: false,
    configs: [require('../base/config'), require('./config')],
    ...opts,
  })
