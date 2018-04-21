import express from 'express'
import path from 'path'

const prepareStatic = () => {
  const publicPath = '/public/'
  const outputPath = path.resolve('./dist/public')
  if (process.env.HOT_MODE) {
    const config = require('./webpack.hot.config')()
    const hotPath = '/public/__webpack_hmr'
    config.entry.unshift(
      `webpack-hot-middleware/client?reload=true&path=${hotPath}`
    )
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
  const staticMiddleware = express.static(outputPath)
  return Promise.resolve(
    publicPath
      ? express.Router().use(publicPath, staticMiddleware)
      : staticMiddleware
  )
}

export default prepareStatic
