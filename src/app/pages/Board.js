import React from 'react'
import { connect } from 'dva'
import { Redirect } from 'dva/router'
// b id src: server

function Board({ board }) {
  if (!board) return <Redirect to="/" />
  return 'board to do'
}

export default connect(({ boards }, { match }) => ({
  board: boards[match.params.board_id],
}))(Board)
