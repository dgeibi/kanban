const ConfigBuilder = require('../utils/ConfigBuilder')

module.exports = opts =>
  new ConfigBuilder({
    server: true,
    configs: [require('../base/config'), require('./config')],
    env: {
      development: {
        KEY1: 'cat_sjjsj',
        KEY2: 'xsxs_dwdw',
        KEY3: 'lmneycbwie13qw!DED2',
      },
    },
    ...opts,
  })
