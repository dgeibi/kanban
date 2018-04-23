const ConfigBuilder = require('../utils/ConfigBuilder')

module.exports = opts =>
  new ConfigBuilder({
    server: true,
    configs: [require('../base/config'), require('./config')],
    env: {
      development: {
        PASSWORD_SECRET: '123deeaxvcd',
        SESSION_KEY: 'cat_sjjsj',
      },
    },
    ...opts,
  })
