import express from 'express'

const prepareStatic = () => {
  const { publicPath, outputPath } = require('config/paths')
  if (process.env.HOT_MODE) {
    const config = require('config/client')({ hot: true }).toConfigSync()
    const hotPath = `${publicPath}__webpack_hmr`
    config.entry = [
      'eventsource/lib/eventsource-polyfill.js',
      `webpack-hot-middleware/client?reload=true&path=${hotPath}`,
    ].concat(config.entry)
    const hot = {
      path: hotPath,
    }
    const webpackMiddleware = require('./webpackMiddleware')
    return webpackMiddleware({
      publicPath,
      outputPath,
      config,
      hot,
    })
  }
  return express.Router().use(publicPath, express.static(outputPath))
}

export default prepareStatic
