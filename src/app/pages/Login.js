import React from 'react'
import { connect } from 'dva'
import { Redirect } from 'dva/router'

function Join({ user, dispatch }) {
  if (user) {
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
        dispatch({
          type: 'user/login',
          payload: data
        })
      }}
    >
      <input name="email" placeholder="email" autoComplete="true" />
      <input
        name="password"
        type="password"
        placeholder="password"
        autoComplete="true"
      />
      <button>提交</button>
    </form>
  )
}

export default connect(({ user }) => ({ user }))(Join)
