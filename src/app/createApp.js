import dva from 'dva'
import hot from 'dva-hot'
import { message } from 'antd'

export default function createApp({ initialState, history, router }) {
  const app = dva({
    initialState,
    history,
    onError() {
      message.error('出错了')
    },
  })
  hot.patch(app)
  app.model(require('./models/user').default)
  app.model(require('./models/cards').default)
  app.model(require('./models/lists').default)
  app.model(require('./models/boards').default)
  app.router(router)
  return app
}
