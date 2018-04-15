import React from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'

function Index({ user, dispatch }) {
  return (
    <React.Fragment>
      Welcome!
      <div>{JSON.stringify(user)}</div>
      {user.logined ? (
        <div>
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'user/logout' })
            }}
          >
            退出
          </button>
        </div>
      ) : (
        <>
          <div>
            <Link to="/login">login</Link>
          </div>
          <div>
            <Link to="/join">join</Link>
          </div>
        </>
      )}
    </React.Fragment>
  )
}

export default connect(({ user }) => ({ user }))(Index)
