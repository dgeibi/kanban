const Env = require('./Env')

module.exports = {
  resolve: {
    alias: {
      '~': Env.src,
    }
  },
}
