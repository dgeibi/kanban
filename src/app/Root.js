import React from 'react'
import { Route, Redirect, Switch } from 'dva/router'
import Frame from './pages/Frame'
import Board from './pages/Board'
import Index from './pages/Index'
import Join from './pages/Join'
import Title from './components/Title'
import Login from './pages/Login'

export default function Root() {
  return (
    <Frame>
      <Title>Kanban</Title>
      <Switch>
        <Route component={Index} path="/" exact />
        <Route component={Join} path="/join" />
        <Route component={Login} path="/login" />
        <Route component={Board} path="/board/:board_id" />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </Frame>
  )
}
