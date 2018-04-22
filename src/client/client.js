import React from 'react'
import { hydrate } from 'react-dom'
import { setContainer } from 'dva-hot'
import { createBrowserHistory } from 'history'
import Loadable from '@7rulnik/react-loadable'

import router from './router'
import createApp from '../app/createApp'
import { setToken } from '../app/utils/request'

const { token, state } = window.__PRELOAD__
delete window.__PRELOAD__

window.__main__ = () => {
  setToken(token)

  const app = createApp({
    router,
    initialState: state,
    history: createBrowserHistory(),
  })

  Loadable.preloadReady().then(() => {
    const App = app.start()
    hydrate(<App />, setContainer('#root'))
  })
}
