const NODE_ENV = process.env.NODE_ENV || 'development'
const webpack = require('webpack')
const define = require('./define')
const merge = require('./merge')

const makeEnv = envs => {
  const env = Object.assign({}, envs.default)
  if (envs[NODE_ENV]) {
    Object.assign(env, envs[NODE_ENV])
  }
  return env
}

module.exports = class ConfigBuilder {
  constructor({ server, env = {}, hot, configs = [] } = {}) {
    this.env = makeEnv(env)
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
