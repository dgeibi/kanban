import { createElement } from 'react'
import { hydrate } from 'react-dom'
import { setContainer } from 'dva-hot'
import { createBrowserHistory } from 'history'

import router from './router'
import createApp from '../app/createApp'
import { setToken } from '../app/utils/request'

const { token, state } = window.__PRELOAD__
delete window.__PRELOAD__

setToken(token)

const app = createApp({
  router,
  initialState: state,
  history: createBrowserHistory(),
})

hydrate(createElement(app.start()), setContainer('#root'))
