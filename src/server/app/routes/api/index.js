import { Router } from 'express'
import debug from 'debug'
import { io } from '~/server/server'
import board from './board'

const api = Router()

const logger = debug('app:api')

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
    }
    next()
  },
  board
)

export default api
