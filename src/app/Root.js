import React from 'react'
import { Route, Redirect, Switch } from 'dva/router'
import Loadable from '@7rulnik/react-loadable'
import Frame from './layouts'
import Title from './components/Title'

function LoadingComponent(props) {
  if (props.error) {
    return <div>Error!</div>
  } else if (props.timedOut) {
    return <div>Taking a long time...</div>
  } else if (props.pastDelay) {
    return <div>Loading...</div>
  } else {
    return null
  }
}

const Board = Loadable({
  loader: () => import('./pages/Board'),
  loading: LoadingComponent,
})

const Index = Loadable({
  loader: () => import('./pages/Index'),
  loading: LoadingComponent,
})

export default function Root() {
  return (
    <Frame>
      <Title>Kanban</Title>
      <Switch>
        <Route component={Index} path="/" exact />
        <Route component={Board} path="/board/:board_id" />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </Frame>
  )
}
