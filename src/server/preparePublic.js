import express from 'express'
import path from 'path'
import createHotMiddleware from './createHotMiddleware'

if (!global.webpackConfig && process.env.HOT_MODE) {
  const webpack = require('webpack') // eslint-disable-line
  const Env = require('~/../webpack/Env')
  Env.definitions['process.env.HOT_MODE'] = true
  const config = require('~/../webpack/client.config')
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  config.entry.unshift('webpack-hot-middleware/client?reload=true&dynamicPublicPath=true')
  global.webpackConfig = config
}

const preparePublic = pathname => {
  if (process.env.HOT_MODE) {
    return createHotMiddleware({ config: global.webpackConfig, pathname })
  }
  return Promise.resolve(express.static(path.resolve('./dist/public')))
}

export default preparePublic
