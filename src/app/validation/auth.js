import isEmail from 'validator/lib/isEmail'

const fields = {
  email: '电子邮箱地址',
  username: '用户名',
  password: '密码',
}

export const required = { required: true, message: '此项必填' }

const usernamePattern = /^[a-zA-Z0-9_-]{3,30}$/
export const username = [
  required,
  {
    type: 'string',
    pattern: usernamePattern,
    message: `${fields.username}必须只包含3到30位字母、数字、下划线、减号`,
  },
]

export const password = [
  required,
  {
    type: 'string',
    min: 6,
    max: 100,
    message: `${fields.password}在6到100位之间`,
  },
]

export const email = [
  required,
  { type: 'email', message: `你输入的不是${fields.email}` },
]

export const emailOrUsername = [
  required,
  {
    validator(rule, value, callback) {
      const errors = []
      if (
        typeof value === 'string' &&
        !isEmail(value) &&
        !usernamePattern.test(value)
      ) {
        errors.push(Error('你输入的不是电子邮箱地址也不是合法的用户名'))
      }
      callback(errors)
    },
  },
]
