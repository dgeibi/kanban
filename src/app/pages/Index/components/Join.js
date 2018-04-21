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
        <FormItem label="邮件地址">
          {getFieldDecorator('email', {
            rules: [validation.email],
          })(<Input type="email" autoComplete="on" />)}
        </FormItem>
        <FormItem label="用户名">
          {getFieldDecorator('username', {
            rules: [validation.username],
          })(<Input autoComplete="on" />)}
        </FormItem>
        <FormItem label="密码">
          {getFieldDecorator('password', {
            rules: [
              validation.password,
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input type="password" autoComplete="on" />)}
        </FormItem>
        <FormItem label="重复密码">
          {getFieldDecorator('confirm', {
            rules: [
              validation.password,
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(
            <Input
              type="password"
              autoComplete="on"
              onBlur={this.handleConfirmBlur}
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
