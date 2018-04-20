import React from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Button } from 'antd'

function Header({ user, dispatch }) {
  return (
    <header>
      {user ? (
        <Button onClick={() => dispatch({ type: 'user/logout' })}>退出</Button>
      ) : (
        <>
          <Button>
            <Link to="/join">注册</Link>
          </Button>
          <Button>
            <Link to="/login">登录</Link>
          </Button>
        </>
      )}
    </header>
  )
}

export default connect(({ user }) => ({ user }))(Header)
