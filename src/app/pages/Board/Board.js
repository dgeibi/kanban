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
  align-items: flex-start;
  height: 100%;
`

const listPlaceHolder = css`
  width: 250px;
  height: 120px;
  border-radius: 5px;
  background: rgba(109, 214, 255, 0.27);
  padding: 8px !important;
  outline: 0;
  border: 0 none;
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
    <Form className={listPlaceHolder}>
      <Form.Item>
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: '必须输入标题' }],
        })(<Input placeholder="标题" autoFocus />)}
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
        if (!clicked) {
          return (
            <button onClick={click} className={listPlaceHolder} type="button">
              增加列
            </button>
          )
        }
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
    if (!result.destination) {
      return
    }

    const { source, destination } = result

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    const { board, dispatch, lists } = this.props

    if (result.type === 'LIST') {
      const ordered = reorder(
        this.props.board.lists,
        source.index,
        destination.index
      )

      this.props.dispatch({
        type: 'boards/reorderLists',
        payload: {
          id: board.id,
          lists: ordered,
        },
      })

      return
    }

    const patches = reorderInner({
      data: lists,
      key: 'cards',
      source,
      destination,
    })

    dispatch({
      type: 'boards/reorderCards',
      payload: {
        id: board.id,
        patches,
      },
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
      board: { lists: ordered, id: boardId },
      dispatch,
    } = this.props

    const board = (
      <Droppable
        droppableId="board"
        type="LIST"
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
                      boardId={boardId}
                      list={lists[key]}
                      dispatch={dispatch}
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
