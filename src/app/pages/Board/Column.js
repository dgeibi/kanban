import { Button, Form, Input, Icon } from 'antd'
import React from 'react'
import { css } from 'emotion'
import { Draggable } from 'react-beautiful-dnd'
import styled from 'react-emotion'
import Toggle from '~/app/components/Toggle'
import List from './List'
import Title from './Title'
import { borderRadius, colors, grid } from './constants'

const { TextArea } = Input

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
      {form.getFieldDecorator('text', {
        rules: [{ required: true }],
      })(<TextArea />)}
      <div
        className={css`
          margin-top: 8px;
        `}
      >
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
      </div>
    </Form>
  )
})

const AddButton = styled.a`
  border-bottom-left-radius: ${borderRadius}px;
  border-bottom-right-radius: ${borderRadius}px;
  background-color: ${({ isDragging }) =>
    isDragging ? colors.blue.lighter : colors.blue.light};
  transition: background-color 0.1s ease;
  padding: ${grid}px;
  padding-top: 14px;
  text-decoration: none;
  color: #182540;
  display: block;
  &:hover {
    background-color: ${colors.blue.lighter};
    color: ${colors.black};
    text-decoration: underline;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${grid}px;
  margin-left: ${grid}px;
  max-height: 100%;
`

const Header = styled.div`
  display: flex;
  flex-shrink: 0;
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  background-color: ${({ isDragging }) =>
    isDragging ? colors.blue.lighter : colors.blue.light};
  transition: background-color 0.1s ease;
`

export default function Column({ id, index, list, dispatch, boardId }) {
  const listId = list.id
  const createCard = x => {
    dispatch({
      type: 'cards/create',
      payload: {
        ...x,
        listId,
        boardId,
      },
    })
  }
  const renderList = ({ click, clicked, blur }) => (
    <>
      <List
        id={listId}
        list={list}
        listType="CARD"
        boardId={boardId}
        add={
          clicked ? (
            <Creator
              onCreate={x => {
                createCard(x)
                blur()
              }}
              onCancel={blur}
            />
          ) : null
        }
      />
      {!clicked && (
        <AddButton onClick={click} href="#">
          添加卡片...
        </AddButton>
      )}
    </>
  )

  const remove = () => {
    dispatch({
      type: 'lists/remove',
      payload: {
        listId,
        boardId,
      },
    })
  }

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
            <Button size="small" onClick={remove}>
              <Icon type="delete" />
            </Button>
          </Header>
          <Toggle>{renderList}</Toggle>
        </Container>
      )}
    </Draggable>
  )
}
