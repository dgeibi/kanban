import express from 'express'

const { publicPath, outputPath } = require('~/../webpack/paths')

const prepareStatic = () => {
  if (process.env.HOT_MODE) {
    const config = require('./webpack.hot.config')()
    const hotPath = `${publicPath}__webpack_hmr`
    config.entry = [
      'eventsource/lib/eventsource-polyfill.js',
      `webpack-hot-middleware/client?reload=true&path=${hotPath}`,
    ].concat(config.entry)
    const hot = {
      path: hotPath,
    }
    return require('./createHotMiddleware').default({
      publicPath,
      outputPath,
      config,
      hot,
    })
  }
  return Promise.resolve(
    express.Router().use(publicPath, express.static(outputPath))
  )
}

export default prepareStatic
