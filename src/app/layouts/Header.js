import React from 'react'
import { connect } from 'dva'
import { Button } from 'antd'
import { css, cx } from 'emotion'
import { Link } from 'dva/router'
import { container, header } from './css'

function Header({ user, dispatch }) {
  return (
    <header className={header}>
      <div
        className={cx(
          container,
          css`
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          `
        )}
      >
        <div>
          <Link to="/">KanKanKanban</Link>
        </div>
        <div>
          {user && (
            <Button
              type="primary"
              onClick={() => dispatch({ type: 'user/logout' })}
              title="登出"
            >
              登出
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export default connect(({ user }) => ({ user }))(Header)
