import { createElement } from 'react'
import { hydrate } from 'react-dom'
import hot from 'dva-hot'
import { createBrowserHistory } from 'history'

import router from './router'
import createApp from '../app/createApp'

const remove = (node) => {
  if (node.remove) {
    node.remove()
  } else if (node.parentNode !== null) {
    node.parentNode.removeChild(node)
  }
}

const initialState = window.PRELOADED_STATE
delete window.PRELOADED_STATE
remove(document.querySelector('#preload'))

const app = createApp({
  router,
  initialState,
  history: createBrowserHistory(),
})

hydrate(createElement(app.start()), hot.setContainer('#root'))
