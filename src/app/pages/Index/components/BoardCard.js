import React from 'react'
import { Form, Button, Input } from 'antd'
import { css } from 'emotion'
import { Link } from 'dva/router'
import Toggle from '~/app/components/Toggle'

const cardShape = css`
  width: 200px;
  height: 120px;
  border-radius: 5px;
  background: rgba(109, 214, 255, 0.27);
  padding: 8px !important;
  margin: 5px !important;
  outline: 0;
  border: 0 none;
`

const CreateButton = function Card({ onClick }) {
  return (
    <button type="button" className={cardShape} onClick={onClick}>
      创建新板
    </button>
  )
}

const Creator = Form.create()(function BoardCreatorInner({
  form,
  onCreate,
  onCancel,
}) {
  const handleCreate = e => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err && onCreate) {
        onCreate(values)
      }
    })
  }

  return (
    <Form className={cardShape}>
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

export function BoardCreator({ onCreate }) {
  return (
    <Toggle>
      {({ clicked, click, blur }) => {
        if (!clicked) return <CreateButton onClick={click} />
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

export const BoardLink = ({ id, title }) => (
  <Link className={cardShape} to={`/board/${id}`}>
    {title}
  </Link>
)
