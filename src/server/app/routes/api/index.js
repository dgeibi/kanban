import { Router } from 'express'
import debug from 'debug'
import { io } from '~/server/server'
import board from './board'

const api = Router()

const logger = debug('app:api')

const noop = () => {}

api.use(
  '/board',
  function bindSocket(req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const { sid } = req.query
      const socket = sid ? io.sockets.sockets[sid] : null
      if (socket) {
        req.ioSocket = socket
        logger('socket-io binding success')
      } else {
        logger('socket-io binding failed - socket id: %s', sid)
      }
      req.toBoard = socket
        ? function toBoard(channel, data) {
            if (!req.board || !req.board.id) return
            socket.to(`board ${req.board.id}`).emit(channel, data)
          }
        : noop
      req.toUser = socket
        ? function toUser(channel, data) {
            socket.to(`user ${req.user.id}`).emit(channel, data)
          }
        : noop
    }
    next()
  },
  board
)

export default api
