const webpack = require('webpack') // eslint-disable-line
const Env = require('~/../webpack/Env')

Env.definitions['process.env.HOT_MODE'] = true

const config = require('~/../webpack/client.config')

config.plugins.push(new webpack.HotModuleReplacementPlugin())
config.entry.unshift(
  'webpack-hot-middleware/client?reload=true&dynamicPublicPath=true'
)

module.exports = config
