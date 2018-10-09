import React, { Component } from 'react'
import styled from 'react-emotion'
import { connect } from 'dva'
import { css } from 'emotion'
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

function InnerList({ list, cards, add, innerRef, placeholder, boardId }) {
  return (
    <div
      ref={innerRef}
      className={css`
        overflow-y: auto;
      `}
    >
      <Cards
        cardOrder={list.cards}
        cards={cards}
        boardId={boardId}
        listId={list.id}
      />
      {placeholder}
      {add}
    </div>
  )
}

const Wrapper = styled.div`
  background-color: ${({ isDraggingOver }) =>
    isDraggingOver ? colors.blue.lighter : colors.blue.light};
  display: flex;
  flex-direction: column;
  opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : 'inherit')};
  padding: ${grid}px;
  padding-bottom: 0;
  transition: background-color 0.1s ease, opacity 0.1s ease;
  user-select: none;
  width: 250px;
  height: 100%;
`

class List extends Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.add && this.props.add) {
      this.innerContainer.scrollTop = this.innerContainer.scrollHeight
    }
  }

  saveInner = x => {
    this.innerContainer = x
  }

  render() {
    const {
      ignoreContainerClipping,
      isDropDisabled,
      id,
      list,
      listType,
      style,
      cards,
      add,
      boardId,
      clicked,
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
            style={style}
            className={clicked ? BottomRoundedStyle : undefined}
            isDraggingOver={dropSnapshot.isDraggingOver}
            isDropDisabled={isDropDisabled}
            {...dropProvided.droppableProps}
            innerRef={dropProvided.innerRef}
          >
            <InnerList
              list={list}
              cards={cards}
              add={add}
              boardId={boardId}
              innerRef={this.saveInner}
              placeholder={dropProvided.placeholder}
            />
          </Wrapper>
        )}
      </Droppable>
    )
  }
}

export default connect(({ cards }) => ({
  cards,
}))(List)
