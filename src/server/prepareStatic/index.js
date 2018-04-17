import express from 'express'
import path from 'path'

const prepareStatic = () => {
  if (process.env.HOT_MODE) {
    const config = require('./webpack.hot.config')
    const createHotMiddleware = require('./createHotMiddleware').default
    return createHotMiddleware({ config })
  }
  return Promise.resolve(express.static(path.resolve('./dist/public')))
}

export default prepareStatic
