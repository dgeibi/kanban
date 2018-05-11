import makeDebug from 'debug'
import db from './models'

const { Board } = db
const debug = makeDebug('app:socket')

export default {
  'board::subscribe': async ({ socket }, data) => {
    if (data && (await Board.findAndCheck(data.id, socket.request.user))) {
      socket.join(`board ${data.id}`)
      socket.emit('board subscribed', {
        id: data.id,
      })
      debug(`%s joined board %s`, socket.request.user.id, data.id)
    } else {
      socket.emit('board subscribe failed')
      debug(
        `%s join board %s failed`,
        socket.request.user.id,
        (data && data.id) || '?'
      )
    }
  },
}
