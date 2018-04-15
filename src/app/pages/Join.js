import React from 'react'
import { connect } from 'dva'
import { Redirect } from 'dva/router'
import request from '../utils/request'

function Join({ user, history, dispatch }) {
  if (user.logined) {
    return <Redirect to="/" />
  }
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        const data = {}
        Array.from(e.currentTarget.elements).forEach(x => {
          if (
            x instanceof HTMLInputElement ||
            x instanceof HTMLSelectElement ||
            x instanceof HTMLTextAreaElement
          ) {
            data[x.name] = x.value
          }
        })
        request('/join', {
          method: 'POST',
          body: JSON.stringify(data),
        }).then(result => {
          if (result.ok) {
            dispatch({
              type: 'user/logined',
              info: {
                username: data.username,
                email: data.email,
              },
            })
            history.push('/')
          } else {
            // notify
          }
        })
        return false
      }}
    >
      <input name="email" placeholder="email" />
      <input name="username" placeholder="username" />
      <input name="password" type="password" placeholder="password" />
      <button>提交</button>
    </form>
  )
}

export default connect(({ user }) => ({ user }))(Join)
