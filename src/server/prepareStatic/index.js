import express from 'express'

const prepareStatic = async app => {
  const { publicPath, outputPath } = require('~/../webpack/paths')
  app.set('publicPath', publicPath)
  app.set('outputPath', outputPath)

  if (process.env.HOT_MODE) {
    const config = require('./webpack.hot.config')()
    const hotPath = `${publicPath}__webpack_hmr`
    config.entry.unshift(
      `webpack-hot-middleware/client?reload=true&path=${hotPath}`
    )
    const hot = {
      path: hotPath,
    }
    const middleware = await require('./createHotMiddleware').default({
      publicPath,
      outputPath,
      config,
      hot,
    })
    app.use(middleware)
  }
  app.use(publicPath, express.static(outputPath))
}

export default prepareStatic
