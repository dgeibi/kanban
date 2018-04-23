const paths = require('../paths')

module.exports = {
  resolve: {
    alias: {
      '~': paths.src,
      config: paths.config,
      'lodash-es': 'lodash',
    },
  },
}
