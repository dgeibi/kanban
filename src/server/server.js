import { createServer } from 'http'
import makeDebug from 'debug'
import logger from 'morgan'
import express from 'express'

import db from './models'
import appPromise from './app'
import handleError from './handleError'
import prepareStatic from './prepareStatic'

const debug = makeDebug('server')

function normalizePort(val) {
  const port = parseInt(val, 10)

  if (Number.isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

const port = normalizePort(process.env.PORT || '3000')

const app = express()
app.set('port', port)

let server
let appRouter

Promise.all([appPromise, db.sequelize.sync()]).then(([_app]) => {
  appRouter = _app

  app.use(logger('dev'))
  app.use(prepareStatic())
  app.use((req, res, next) => {
    appRouter(req, res, next)
  })
  app.use(handleError)

  server = createServer(app)
  server.listen(port, () => {
    debug(`Express server listening on port ${server.address().port}`)
  })
  server.on('error', error => {
    if (error.syscall !== 'listen') {
      throw error
    }
    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`)
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`)
        process.exit(1)
        break
      default:
        throw error
    }
  })
  server.on('listening', () => {
    const addr = server.address()
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
    debug(`Listening on ${bind}`)
  })
})

if (process.env.HOT_MODE) {
  module.hot.accept('./app', () => {
    appPromise.then(_app => {
      appRouter = _app
    })
  })
}
