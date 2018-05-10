// https://github.com/babel/babel/blob/v7.0.0-beta.46/packages/babel-preset-env/src/built-in-definitions.js

import 'core-js/modules/es6.symbol'
import 'core-js/modules/es7.symbol.async-iterator'
import 'core-js/modules/es6.object.to-string'
import 'core-js/modules/es6.promise'
import 'core-js/modules/es6.function.name'
import 'core-js/modules/es6.set'
import 'core-js/modules/es6.map'
import 'core-js/modules/es6.object.assign'
import 'core-js/modules/es6.array.find'
import 'core-js/modules/es6.weak-map'
import 'core-js/modules/es6.string.iterator'
import 'core-js/modules/web.dom.iterable'
import 'regenerator-runtime/runtime'

import { createElement } from 'react'
import { hydrate } from 'react-dom'
import { setContainer } from 'dva-hot'
import { createBrowserHistory } from 'history'
import Loadable from '@7rulnik/react-loadable'

import createApp from '~/app/createApp'
import { setToken } from '~/app/utils/csrfToken'
import { connect } from '~/app/utils/socket'
import router from './router'
import './global.css'

const { token, state } = JSON.parse(
  window.atob(document.querySelector('#app-data').textContent) || '{}'
)
setToken(token)

const app = createApp({
  router,
  initialState: state,
  history: createBrowserHistory(),
})

Promise.all([state.user && connect(), Loadable.preloadReady()]).then(() => {
  hydrate(createElement(app.start()), setContainer('#root'), () => {
    Loadable.preloadAll()
  })
})
