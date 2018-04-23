const webpack = require('webpack')
const define = require('./define')
const merge = require('./merge')

module.exports = class ConfigBuilder {
  constructor({ server, env = {}, hot, configs = [], NODE_ENV } = {}) {
    this.env = {}
    Object.assign(this.env, env.default)
    NODE_ENV = NODE_ENV || process.env.NODE_ENV || 'development'
    if (NODE_ENV !== 'default' && env[NODE_ENV]) {
      Object.assign(this.env, env[NODE_ENV])
    }
    this.env.NODE_ENV = NODE_ENV
    this.env.SERVER = Boolean(server)
    this.env.HOT_MODE = Boolean(hot)
    this.configs = configs
  }

  toConfig(extra, sync) {
    return (sync ? merge.sync : merge)(
      [
        ...this.configs,
        {
          plugins: [
            define(this.toDefinition()),
            this.env.HOT_MODE && new webpack.HotModuleReplacementPlugin(),
          ].filter(x => !!x),
        },
        (this.env.NODE_ENV === 'development' ||
          this.env.NODE_ENV === 'production') && {
          mode: this.env.NODE_ENV,
        },
        extra,
      ],
      this.env
    )
  }

  toConfigSync(extra) {
    return this.toConfig(extra, true)
  }

  toDefinition() {
    const definitions = {}
    Object.keys(this.env).forEach(key => {
      definitions[`process.env.${key}`] = this.env[key]
    })
    return definitions
  }
}
