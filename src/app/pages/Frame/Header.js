import React from 'react'
import { connect } from 'dva'

function Header() {
  return <header> this is header </header>
}

export default connect(({ user }) => ({ user }))(Header)
