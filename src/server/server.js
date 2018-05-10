import { createServer } from 'http'
import makeDebug from 'debug'
import socketIO from 'socket.io'
import security from '~/server/security/middleware'
import app from './app'
import socketHandlers from './socketHandlers'

export const server = createServer(app)
export const io = socketIO(server)

io.use((socket, next) => {
  security(socket.request, socket.request.res, err => {
    if (err) {
      next(err)
    } else if (!socket.request.user) {
      next(Error('Authentication error'))
    } else {
      next()
    }
  })
})

io.sockets.on('connection', socket => {
  Object.keys(socketHandlers).forEach(channel => {
    socket.on(channel, data => {
      socketHandlers[channel]({ socket, io }, data)
    })
  })
})

const debug = makeDebug('server')

server.on('listening', () => {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
  debug(`Listening on ${bind}`)
})
