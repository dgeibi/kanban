import db from './models'
import { server } from './server'
import { preloadPromise } from './app'

function normalizePort(val) {
  const port = Math.floor(val)

  if (Number.isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

const port = normalizePort(process.env.PORT || '3000')

Promise.all([preloadPromise, db.sequelize.sync()]).then(() => {
  server.listen(port)
})
