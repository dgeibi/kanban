import { connect } from 'dva'
import { Redirect } from 'dva/router'
import { Button } from 'antd'
import styled from 'react-emotion'
import React from 'react'
import Title from './Title'
import Board from './Board'
import DocTitle from '~/app/components/Title'

const Wrapper = styled.div`
  padding-top: 8px;
  overflow-x: scroll;
  height: calc(100vh - 147px);
`

const Header = styled.div`
  padding: 4px 8px;
`

const top = {
  marginTop: '2px',
}

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
          <DocTitle>{board.title}</DocTitle>
          <Header>
            <Title onChange={this.handleTitleUpdate}>{board.title}</Title>
            <div style={top}>
              <Button onClick={this.remove}>删除看板</Button>
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
