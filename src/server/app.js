import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import favicon from 'serve-favicon'
import path from 'path'
import Loadable from '@7rulnik/react-loadable'

import prepareStatic from './prepareStatic'
import security from './security/middleware'
import { auenticated } from './security/auth'

import login from './routes/login'
import logout from './routes/logout'
import join from './routes/join'
import api from './routes/api'

import fetchClientData from './fetchClientData'
import render from './render'
import handleError from './handleError'

const app = express()

const provideVariables = variables => (req, res, next) => {
  variables.forEach(k => {
    req[k] = app.get(k)
  })
  next()
}

export default prepareStatic(app).then(() => {
  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(security)
  app.use(favicon(path.resolve('favicon.ico')))

  app.use('/join', join)
  app.use('/login', login)
  app.use('/logout', logout)
  app.use('/api', auenticated, api)

  app.get(
    '*',
    fetchClientData,
    provideVariables(['publicPath', 'outputPath']),
    render
  )
  app.use(handleError)

  return Loadable.preloadAll().then(() => app)
})
