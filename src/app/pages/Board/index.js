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
}))(
  class BoardPage extends React.Component {
    componentDidMount() {
      const { board, dispatch } = this.props
      if (!board.lists) {
        dispatch({
          type: 'boards/fetch',
          payload: {
            id: board.id,
          },
        })
      }
      if (!board.subscribed) {
        dispatch({
          type: 'boards/subscribe',
          payload: {
            id: board.id,
          },
        })
      }
    }

    render() {
      const { board, dispatch, lists } = this.props
      if (!board) return <Redirect to="/" />
      return (
        <>
          <Header>
            <h3>{board.title}</h3>
          </Header>
          <Wrapper>
            {board.lists &&
              board.lists.length > 0 && (
                <Board dispatch={dispatch} board={board} lists={lists} />
              )}
          </Wrapper>
        </>
      )
    }
  }
)
