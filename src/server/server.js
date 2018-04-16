import { createServer } from 'http'
import makeDebug from 'debug'

import db from './models'
import appPromise from './app'

const debug = makeDebug('express-sequelize')

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10)

  if (Number.isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

const port = normalizePort(process.env.PORT || '3000')

const enhanceApp = app => {
  app.set('port', port)
}

let server
let lastApp

appPromise.then(app => {
  lastApp = app
  enhanceApp(app)
  server = createServer(app)
  db.sequelize.sync().then(() => {
    server.listen(port, () => {
      debug(`Express server listening on port ${server.address().port}`)
    })
    server.on('error', error => {
      if (error.syscall !== 'listen') {
        throw error
      }

      const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

      // handle specific listen errors with friendly messages
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
      const bind =
        typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
      debug(`Listening on ${bind}`)
    })
  })
})

if (process.env.HOT_MODE) {
  module.hot.accept('./app', () => {
    if (lastApp && server) {
      server.removeListener('request', lastApp)
      lastApp = null
      appPromise.then(newApp => {
        enhanceApp(newApp)
        server.on('request', newApp)
        lastApp = newApp
      })
    }
  })
}
