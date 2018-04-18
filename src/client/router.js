import { router } from 'dva-hot'
import { routerRedux } from 'dva/router'
import React from 'react'
import Root from '../app/Root'

const { ConnectedRouter } = routerRedux

function RouterConfig({ history }) {
  return (
    <ConnectedRouter history={history}>
      <Root />
    </ConnectedRouter>
  )
}

export default router(module)(RouterConfig)
