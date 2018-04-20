const paths = require('../paths')

module.exports = {
  resolve: {
    alias: {
      '~': paths.src,
      'lodash-es': 'lodash',
    },
  },
}
