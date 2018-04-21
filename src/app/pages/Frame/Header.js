import React from 'react'
import { connect } from 'dva'
import { Button } from 'antd'

function Header({ user, dispatch }) {
  return (
    <header>
      {user && (
        <Button onClick={() => dispatch({ type: 'user/logout' })}>退出</Button>
      )}
    </header>
  )
}

export default connect(({ user }) => ({ user }))(Header)
