import express from 'express'

const prepareStatic = ({ addTask }) => {
  const { publicPath, outputPath } = require('config/paths')
  if (process.env.HOT_MODE) {
    const config = require('config/client')({ hot: true }).toConfigSync()
    const hotPath = `${publicPath}__webpack_hmr`
    const prependEntry = require('config/prependEntry')
    config.entry = prependEntry(config.entry, [
      'eventsource/lib/eventsource-polyfill.js',
      `webpack-hot-middleware/client?reload=true&path=${hotPath}`,
    ])
    const hotMiddleware = {
      path: hotPath,
    }
    const webpackMiddleware = require('config/webpackMiddleware')
    const middleware = webpackMiddleware({
      publicPath,
      config,
      hotMiddleware,
    })
    addTask(middleware.untilValid)
    return middleware
  }
  return express.Router().use(publicPath, express.static(outputPath))
}

export default prepareStatic
