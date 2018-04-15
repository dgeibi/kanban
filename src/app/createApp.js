import dva from 'dva'
import hot from 'dva-hot'

export default function createApp({ initialState, history, router }) {
  const app = dva({
    initialState,
    history,
  })
  hot.patch(app)
  app.model(require('./models/user').default)
  app.model(require('./models/board').default)
  app.router(router)
  return app
}
