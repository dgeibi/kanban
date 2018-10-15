import React, { Component } from 'react'
import { connect } from 'dva'
import styled from 'react-emotion'
import { Droppable, Draggable } from 'react-beautiful-dnd'

import Card from './Card'
import { BottomRoundedStyle } from './styles'
import { grid, colors } from './constants'

function Cards({ cardOrder, cards, boardId, listId }) {
  return cardOrder
    ? cardOrder.map((key, index) => (
        <Draggable key={key} draggableId={key} index={index}>
          {(dragProvided, dragSnapshot) => (
            <Card
              card={cards[key]}
              isDragging={dragSnapshot.isDragging}
              provided={dragProvided}
              boardId={boardId}
              listId={listId}
            />
          )}
        </Draggable>
      ))
    : null
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  transition: background-color 0.1s ease, opacity 0.1s ease;
  user-select: none;
  ${BottomRoundedStyle};
  background-color: ${({ isDraggingOver }) =>
    isDraggingOver ? colors.blue.lighter : colors.blue.light};
  opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : 'inherit')};
  padding: ${grid}px;
  overflow-y: scroll;
  overflow-x: hidden;
`

class List extends Component {
  render() {
    const {
      ignoreContainerClipping,
      isDropDisabled,
      id,
      list,
      listType,
      cards,
      add,
      boardId,
    } = this.props
    return (
      <Droppable
        droppableId={id}
        type={listType}
        ignoreContainerClipping={ignoreContainerClipping}
        isDropDisabled={isDropDisabled}
      >
        {(dropProvided, dropSnapshot) => (
          <Wrapper
            innerRef={dropProvided.innerRef}
            {...dropProvided.droppableProps}
            isDraggingOver={dropSnapshot.isDraggingOver}
            isDropDisabled={isDropDisabled}
          >
            <Cards
              cardOrder={list.cards}
              cards={cards}
              boardId={boardId}
              listId={list.id}
            />
            {dropProvided.placeholder}
            {add}
          </Wrapper>
        )}
      </Droppable>
    )
  }
}

export default connect(({ cards }) => ({
  cards,
}))(List)
