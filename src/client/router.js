import hot from 'dva-hot'
import React from 'react'
import { routerRedux } from 'dva/router'
import Root from '../app/Root'

const { ConnectedRouter } = routerRedux

function RouterConfig({ history }) {
  return (
    <ConnectedRouter history={history}>
      <Root />
    </ConnectedRouter>
  )
}

export default hot.router(module)(RouterConfig)
