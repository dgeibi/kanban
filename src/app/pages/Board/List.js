import React from 'react'
import styled from 'react-emotion'
import { connect } from 'dva'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Toggle from '~/app/components/Toggle'
import { Form, Button, Input } from 'antd'
import { css } from 'emotion'

import Card from './Card'
import { grid, colors } from './constants'

const { TextArea } = Input

function Cards({ cardOrder, cards }) {
  return cardOrder
    ? cardOrder.map((key, index) => (
        <Draggable key={key} draggableId={key} index={index}>
          {(dragProvided, dragSnapshot) =>
            cards[key] && (
              <Card
                card={cards[key]}
                isDragging={dragSnapshot.isDragging}
                provided={dragProvided}
              />
            )
          }
        </Draggable>
      ))
    : null
}

const Creator = Form.create()(({ form, onCreate, onCancel }) => {
  const handleCreate = e => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err && onCreate) {
        onCreate(values)
      }
    })
  }

  return (
    <Form>
      <Form.Item>
        {form.getFieldDecorator('text', {
          rules: [{ required: true, message: '输入内容才能创建新的卡片' }],
        })(<TextArea />)}
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          onClick={handleCreate}
          type="primary"
          className={css`
            margin-right: 5px;
          `}
        >
          添加
        </Button>
        <Button onClick={onCancel}>取消</Button>
      </Form.Item>
    </Form>
  )
})

function CardCreator({ onCreate }) {
  return (
    <Toggle>
      {({ click, clicked, blur }) => {
        if (!clicked)
          return (
            <button onClick={click} type="button">
              add card
            </button>
          )
        return (
          <Creator
            onCreate={x => {
              onCreate(x)
              blur()
            }}
            onCancel={blur}
          />
        )
      }}
    </Toggle>
  )
}

const DropZone = styled.div`
  min-height: 250px;
  margin-bottom: ${grid}px;
`

const InnerList = connect(({ cards }) => ({
  cards,
}))(function InnerList({ list, dropProvided, cards, dispatch }) {
  const createCard = x => {
    dispatch({
      type: 'cards/create',
      payload: {
        ...x,
        listId: list.id,
        boardId: list.boardId,
      },
    })
  }

  return (
    <DropZone innerRef={dropProvided.innerRef}>
      <Cards cardOrder={list.cards} cards={cards} />
      {dropProvided.placeholder}
      <CardCreator onCreate={createCard} />
    </DropZone>
  )
})

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 300px;
`

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
`

export default function List({
  ignoreContainerClipping,
  internalScroll,
  isDropDisabled,
  id,
  list,
  listType,
  style,
}) {
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
          isDraggingOver={dropSnapshot.isDraggingOver}
          isDropDisabled={isDropDisabled}
          {...dropProvided.droppableProps}
        >
          {internalScroll ? (
            <ScrollContainer>
              <InnerList list={list} dropProvided={dropProvided} />
            </ScrollContainer>
          ) : (
            <InnerList list={list} dropProvided={dropProvided} />
          )}
        </Wrapper>
      )}
    </Droppable>
  )
}
