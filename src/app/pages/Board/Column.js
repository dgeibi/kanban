import { Button, Form, Input } from 'antd'
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
  flex-shrink: 0;
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  background-color: ${({ isDragging }) =>
    isDragging ? colors.blue.lighter : colors.blue.light};
  transition: background-color 0.1s ease;
  &:hover {
    background-color: ${colors.blue.lighter};
  }
`

export default function Column({ id, index, list, dispatch }) {
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
  const renderList = ({ click, clicked, blur }) => (
    <>
      <List
        id={list.id}
        list={list}
        listType="CARD"
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
          <Toggle>{renderList}</Toggle>
        </Container>
      )}
    </Draggable>
  )
}
