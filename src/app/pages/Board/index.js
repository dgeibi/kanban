import { connect } from 'dva'
import { Redirect } from 'dva/router'
import { Button } from 'antd'
import styled from 'react-emotion'
import React from 'react'
import Title from './Title'
import Board from './Board'

const Wrapper = styled.div`
  padding: 0 8px;
  overflow-x: auto;
  height: calc(100vh - 155px);
`

const Header = styled.div`
  padding: 4px 16px;
`

export default connect(({ boards, lists }, { match }) => ({
  board: boards && boards[match.params.board_id],
  lists,
}))(
  class BoardPage extends React.Component {
    componentDidMount() {
      const { board, dispatch } = this.props
      if (!board) return
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

    remove = () => {
      this.props.dispatch({
        type: 'boards/remove',
        payload: {
          boardId: this.props.board.id,
        },
      })
    }

    handleTitleUpdate = title => {
      this.props.dispatch({
        type: 'boards/update',
        payload: {
          boardId: this.props.board.id,
          data: {
            title,
          },
        },
      })
    }

    render() {
      const { board, dispatch, lists } = this.props
      if (!board) return <Redirect to="/" />

      return (
        <>
          <Header>
            <Title onChange={this.handleTitleUpdate}>{board.title}</Title>
            <div>
              <Button onClick={this.remove}>Delete</Button>
            </div>
          </Header>
          <Wrapper>
            <Board dispatch={dispatch} board={board} lists={lists} />
          </Wrapper>
        </>
      )
    }
  }
)
