import React from 'react'
import { Route, Redirect, Switch } from 'dva/router'
import Frame from './pages/Frame'
import Board from './pages/Board'
import Index from './pages/Index'
import Title from './components/Title'

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
