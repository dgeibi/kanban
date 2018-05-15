import io from 'socket.io-client'
import { getToken } from './csrfToken'

/** @type {SocketIOClient.Socket} */
let socket
export const getSocket = () => socket

const onceConnect = []
const sub = fn => {
  onceConnect.push(fn)
}
const unsub = fn => {
  for (let i = onceConnect.length - 1; i > -1; i--) {
    if (onceConnect[i] === fn) {
      onceConnect.splice(i, 1)
    }
  }
}

export const connect = () => {
  if (socket) {
    throw Error('you have been connected!')
  }
  socket = io(`/?_csrf=${getToken()}`)
  return new Promise((resolve, reject) => {
    socket.once('connect', () => {
      resolve()
      onceConnect.forEach(fn => fn())
      onceConnect.splice(0)
    })
    socket.once('error', reject)
  })
}

export const subscribe = (handlers, dispatch) => {
  if (process.env.SERVER) return null

  const doSubscribe = () => {
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

  if (socket) {
    return doSubscribe()
  } else {
    // subscribe once connect
    let off
    const subscribeAndHoistOff = () => {
      off = doSubscribe()
    }
    sub(subscribeAndHoistOff)
    return () => {
      unsub(subscribeAndHoistOff)
      if (off) {
        off()
      }
    }
  }
}
