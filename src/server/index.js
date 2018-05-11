import db from './models'
import { server } from './server'
import { normalizePort } from './helper'
import { flushTasks, addTask } from './tasks'

const port = normalizePort(process.env.PORT || '3000')
const host = process.env.HOST || '0.0.0.0'

addTask(db.sequelize.sync())

flushTasks().then(() => {
  server.listen(port, host)
})
