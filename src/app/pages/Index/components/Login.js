import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import * as validation from '~/app/validation/auth'

const FormItem = Form.Item

class Login extends Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && this.props.onLogin) {
        this.props.onLogin(values)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="用户名或邮件地址">
          {getFieldDecorator('emailOrUsername', {
            rules: validation.emailOrUsername,
          })(<Input autoComplete="on" />)}
        </FormItem>
        <FormItem label="密码">
          {getFieldDecorator('password', {
            rules: validation.password,
          })(<Input type="password" autoComplete="on" />)}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(Login)
