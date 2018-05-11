import express from 'express'
import { addTask } from '~/server/tasks'

const prepareStatic = () => {
  const { publicPath, outputPath } = require('config/paths')
  if (process.env.HOT_MODE) {
    const config = require('config/client')({ hot: true }).toConfigSync()
    const hotPath = `${publicPath}__webpack_hmr`
    const prependEntry = require('config/prependEntry')
    config.entry = prependEntry(config.entry, [
      'eventsource/lib/eventsource-polyfill.js',
      `webpack-hot-middleware/client?reload=true&path=${hotPath}`,
    ])
    const hot = {
      path: hotPath,
    }
    const webpackMiddleware = require('config/webpackMiddleware')
    const middleware = webpackMiddleware({
      publicPath,
      outputPath,
      config,
      hot,
    })
    addTask(middleware.untilValid)
    return middleware
  }
  return express.Router().use(publicPath, express.static(outputPath))
}

export default prepareStatic
