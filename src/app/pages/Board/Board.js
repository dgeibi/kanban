import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import React, { Component } from 'react'
import styled from 'react-emotion'
import Toggle from '~/app/components/Toggle'

import { css } from 'emotion'
import { Form, Button, Input } from 'antd'
import { reorder, reorderInner } from './reorder'
import Column from './Column'

const ContainerLists = styled.div`
  display: inline-flex;
`

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
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: '必须输入标题' }],
        })(<Input placeholder="标题" />)}
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
          创建
        </Button>
        <Button onClick={onCancel}>取消</Button>
      </Form.Item>
    </Form>
  )
})

function ListCreator({ onCreate }) {
  return (
    <Toggle>
      {({ click, clicked, blur }) => {
        if (!clicked)
          return (
            <button onClick={click} type="button">
              add list
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

export default class Board extends Component {
  onDragStart = () => {}

  onDragEnd = result => {
    // dropped nowhere
    if (!result.destination) {
      return
    }

    const { source, destination } = result

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    const { board, dispatch, lists } = this.props
    // reordering column
    if (result.type === 'COLUMN') {
      const ordered = reorder(
        this.props.board.lists,
        source.index,
        destination.index
      )

      this.props.dispatch({
        type: 'boards/reorder',
        payload: {
          id: board.id,
          listOrder: ordered,
        },
      })

      return
    }

    const cardOrders = reorderInner({
      data: lists,
      key: 'cards',
      source,
      destination,
    })

    dispatch({
      type: 'lists/reorderCards',
      payload: cardOrders,
    })
  }

  handleCreate = data => {
    this.props.dispatch({
      type: 'lists/create',
      payload: {
        ...data,
        boardId: this.props.board.id,
      },
    })
  }

  render() {
    const {
      containerHeight,
      lists,
      board: { lists: ordered },
    } = this.props

    const board = (
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="horizontal"
        ignoreContainerClipping={Boolean(containerHeight)}
      >
        {provided => (
          <ContainerLists
            innerRef={provided.innerRef}
            {...provided.droppableProps}
          >
            {ordered &&
              ordered.map(
                (key, index) =>
                  lists[key] && (
                    <Column
                      key={key}
                      index={index}
                      id={key}
                      list={lists[key]}
                    />
                  )
              )}
            <ListCreator onCreate={this.handleCreate} />
          </ContainerLists>
        )}
      </Droppable>
    )

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        {board}
      </DragDropContext>
    )
  }
}
