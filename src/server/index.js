import db from './models'
import { server } from './server'
import { preloadPromise } from './app'
import { normalizePort } from './helper'

const port = normalizePort(process.env.PORT || '3000')

Promise.all([preloadPromise, db.sequelize.sync()]).then(() => {
  server.listen(port)
})
