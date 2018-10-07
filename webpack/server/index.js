const ConfigBuilder = require('../utils/ConfigBuilder')

module.exports = opts =>
  new ConfigBuilder({
    server: true,
    configs: [require('../base/config'), require('./config')],
    env: {
      development: {
        SESSION_KEYS: 'cat_sjjsj,xsxs_dwdw,lmneycbwie13qw!DED2',
      },
    },
    ...opts,
  })
