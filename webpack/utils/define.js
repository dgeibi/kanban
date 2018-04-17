const webpack = require('webpack')

const define = (opts = {}) => {
  const keys = Object.keys(opts)
  if (keys.length < 1) return null

  const definitions = {}
  keys.forEach(key => {
    const value = JSON.stringify(opts[key])
    definitions[key] = value
  })
  return new webpack.DefinePlugin(definitions)
}

module.exports = define