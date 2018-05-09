import io from 'socket.io-client'
import { getToken } from './csrfToken'

/** @type {SocketIOClient.Socket} */
let socket
export const getSocket = () => socket

export const connect = () => {
  socket = io(`${window.location.origin}?_csrf=${getToken()}`)
  return new Promise((resolve, reject) => {
    socket.once('connect', resolve)
    socket.once('error', reject)
  })
}

export const subscribe = (handlers, dispatch) => {
  if (process.env.SERVER) return null
  getSocket()
  const offs = Object.keys(handlers).map(channel => {
    const handler = data => {
      handlers[channel](socket, dispatch, data)
    }
    socket.on(channel, handler)
    return () => {
      socket.removeListener(channel, handler)
    }
  })
  return () => {
    offs.forEach(fn => fn())
  }
}
