import { Draggable } from 'react-beautiful-dnd'
import React from 'react'
import styled from 'react-emotion'
import { borderRadius, colors, grid } from './constants'
import List from './List'
import Title from './Title'

const Container = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  background-color: ${({ isDragging }) =>
    isDragging ? colors.blue.lighter : colors.blue.light};
  transition: background-color 0.1s ease;
  &:hover {
    background-color: ${colors.blue.lighter};
  }
`

export default function Column({ id, index, list }) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <Container innerRef={provided.innerRef} {...provided.draggableProps}>
          <Header isDragging={snapshot.isDragging}>
            <Title
              isDragging={snapshot.isDragging}
              {...provided.dragHandleProps}
            >
              {list.title}
            </Title>
          </Header>
          <List id={list.id} list={list} listType="CARD" />
        </Container>
      )}
    </Draggable>
  )
}
