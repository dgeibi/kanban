import makeDebug from 'debug'
import { createServer } from 'http'
import socketIO from 'socket.io'
import { security } from '~/server/security'
import app from './app'
import socketHandlers from './socketHandlers'
import { addTask } from './tasks'

export const server = createServer(app({ addTask }))
const io = socketIO(server)

global.io = io

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
  socket.join(`user ${socket.request.user.id}`)
  Object.keys(socketHandlers).forEach(channel => {
    socket.on(channel, data => {
      socketHandlers[channel]({ socket, io }, data)
    })
  })
})

const debug = makeDebug('app:server')

server.on('listening', () => {
  const addr = server.address()
  debug('host: %s, port: %s', addr.address, addr.port)
  debug(`Open in browser: http://127.0.0.1:${addr.port}`)
})
