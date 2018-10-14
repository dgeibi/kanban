import { Button, Icon } from 'antd'
import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import styled from 'react-emotion'
import { css } from 'emotion'

import Toggle from '~/app/components/Toggle'
import List from './List'
import Title from './Title'
import { colors, grid } from './constants'
import { CardCreator } from './CardInput'
import { TopRoundedStyle } from './styles'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${grid}px;
  margin-left: ${grid}px;
  max-height: 100%;
  width: 250px;
`

const Header = styled.div`
  ${TopRoundedStyle};
  display: flex;
  flex-shrink: 0;
  background-color: ${({ isDragging }) =>
    isDragging ? colors.blue.lighter : colors.blue.light};
  transition: background-color 0.1s ease;
`

const BottomStyle = css`
  margin-bottom: ${grid}px;
`

class Column extends React.Component {
  remove = () => {
    const { list, dispatch, boardId } = this.props
    const listId = list.id

    dispatch({
      type: 'lists/remove',
      payload: {
        listId,
        boardId,
      },
    })
  }

  renderList() {
    const { list, boardId } = this.props
    const listId = list.id

    return (
      <Toggle>
        {({ clicked, click, blur }) => (
          <List
            id={listId}
            list={list}
            listType="CARD"
            boardId={boardId}
            clicked={clicked}
            add={
              <>
                <CardCreator
                  active={clicked}
                  onSubmit={v => {
                    this.createCard(v)
                    blur()
                  }}
                  onCancel={blur}
                />
                <div>
                  {!clicked && (
                    <Button onClick={click} className={BottomStyle}>
                      添加卡片
                    </Button>
                  )}
                </div>
              </>
            }
          />
        )}
      </Toggle>
    )
  }

  createCard = x => {
    const { list, dispatch, boardId } = this.props
    const listId = list.id

    dispatch({
      type: 'cards/create',
      payload: {
        ...x,
        listId,
        boardId,
      },
    })
  }

  updateListTitle = title => {
    const { list, dispatch, boardId } = this.props
    const listId = list.id

    return dispatch({
      type: 'lists/update',
      payload: {
        listId,
        boardId,
        data: {
          title,
        },
      },
    })
  }

  render() {
    const { id, index, list } = this.props
    return (
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <Container
            innerRef={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Header isDragging={snapshot.isDragging}>
              <Title onChange={this.updateListTitle}>{list.title}</Title>
              <Button size="small" onClick={this.remove}>
                <Icon type="delete" />
              </Button>
            </Header>
            {this.renderList()}
          </Container>
        )}
      </Draggable>
    )
  }
}

export default Column
