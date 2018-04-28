import { connect } from 'dva'
import { Redirect } from 'dva/router'
import styled from 'react-emotion'
import React from 'react'
import Board from './Board'

const Wrapper = styled.div`
  padding: 0 8px;
  overflow-x: auto;
`

const Header = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 16px;
`

export default connect(({ boards, lists }, { match }) => ({
  board: boards && boards[match.params.board_id],
  lists,
}))(function BoardPage({ board, dispatch, lists }) {
  if (!board) return <Redirect to="/" />
  if (!board.lists) {
    dispatch({
      type: 'boards/fetch',
      id: board.id,
    })
  }
  const { title } = board

  return (
    <>
      <Header>
        <h3>{title}</h3>
      </Header>
      <Wrapper>
        <Board dispatch={dispatch} board={board} lists={lists} />
      </Wrapper>
    </>
  )
})
