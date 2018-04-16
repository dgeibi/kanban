import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'

import preparePublic from './preparePublic'
import security from './security/middleware'
import auth from './security/auth'
// import favicon from 'serve-favicon'

import login from './routes/login'
import logout from './routes/logout'
import join from './routes/join'
import fetchClientData from './fetchClientData'
import render from './render'
import handleError from './handleError'

export default preparePublic().then(staticMiddleware => {
  const app = express()
  app.use(logger('dev'))
  app.use('/public', staticMiddleware)
  app.use(bodyParser.json())
  app.use(security)
  // app.use(favicon(`${__dirname}/public/favicon.ico`))

  app.use('/join', join)
  app.use('/login', login)
  app.use('/logout', logout)
  app.all('/api/*', auth)
  app.get('*', fetchClientData, render)
  app.use(handleError)
  return app
})
