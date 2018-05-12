import { server } from './server'
import { normalizePort } from './helper'
import { flushTasks } from './tasks'

const port = normalizePort(process.env.PORT || '3000')
const host = process.env.HOST || '0.0.0.0'

flushTasks().then(() => {
  server.listen(port, host)
})
