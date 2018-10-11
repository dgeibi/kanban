import './polyfill'
/* eslint-disable import/first */
import { createElement } from 'react'
import { hydrate } from 'react-dom'
import { setContainer } from 'dva-hot'
import { createBrowserHistory } from 'history'
import Loadable from 'react-loadable'
import createApp from '~/app/createApp'
import { setToken } from '~/app/utils/csrfToken'
import { connect } from '~/app/utils/socket'
import router from './router'
import './global.css'

const { token, state } = JSON.parse(
  decodeURI(window.atob(document.querySelector('#app-data').innerText))
)
setToken(token)

const app = createApp({
  router,
  initialState: state,
  history: createBrowserHistory(),
})

Promise.all([state.user && connect(), Loadable.preloadReady()]).then(() => {
  hydrate(createElement(app.start()), setContainer('#root'))
})
