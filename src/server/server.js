import { createServer } from 'http'
import makeDebug from 'debug'
import socketIO from 'socket.io'
import security from '~/server/security/middleware'
import app from './app'
import db from './models'

const { Board } = db
const debug = makeDebug('server')

export const server = createServer(app)

export const io = socketIO(server)

io.use((socket, next) => {
  security(socket.request, socket.request.res, next)
})

io.sockets.on('connection', socket => {
  socket.on('board::subscribe', data => {
    if (!socket.request.user) return
    Board.findAndCheck(data.id, socket.request.user).then(x => {
      if (x) {
        socket.join(`board ${data.id}`)
        socket.emit('board subscribed', {
          id: data.id,
        })
      }
    })
  })
})

server.on('listening', () => {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
  debug(`Listening on ${bind}`)
})
