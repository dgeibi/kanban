import React from 'react'
import { connect } from 'dva'
import Boards from './components/Boards'
import LoginOrJoin from './components/LoginOrJoin'

function Index({ user, dispatch }) {
  if (!user)
    return (
      <LoginOrJoin
        onJoin={info => {
          dispatch({
            type: 'user/join',
            payload: info,
          })
        }}
        onLogin={info => {
          dispatch({
            type: 'user/login',
            payload: info,
          })
        }}
      />
    )
  return <Boards />
}

export default connect(({ user }) => ({ user }))(Index)
