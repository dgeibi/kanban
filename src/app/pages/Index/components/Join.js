import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import * as validation from '~/app/validation/auth'

const FormItem = Form.Item

class Join extends Component {
  state = {}

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && this.props.onJoin) {
        this.props.onJoin(values)
      }
    })
  }

  handleConfirmBlur = e => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致！')
    } else {
      callback()
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('email', {
            rules: validation.email,
          })(
            <Input type="email" autoComplete="email" placeholder="邮件地址" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('username', {
            rules: validation.username,
          })(<Input autoComplete="on" placeholder="用户名" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: validation.password.concat([
              {
                validator: this.validateToNextPassword,
              },
            ]),
          })(
            <Input
              type="password"
              autoComplete="on"
              placeholder="密码（至少12位）"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('confirm', {
            rules: validation.password.concat([
              {
                validator: this.compareToFirstPassword,
              },
            ]),
          })(
            <Input
              type="password"
              autoComplete="on"
              onBlur={this.handleConfirmBlur}
              placeholder="重复输入密码"
            />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            注册
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(Join)
