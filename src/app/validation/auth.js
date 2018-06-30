import normalizeEmail from './normalizeEmail'

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

/**
 * 虽然 bcrypt 算法输入有大小限制（72字节）
 * 但一般人不会输入那么多，所以过长就截断吧……
 */
export const password = [
  required,
  {
    type: 'string',
    min: 12,
    message: `${fields.password}至少12位`,
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
        !normalizeEmail(value) &&
        !usernamePattern.test(value)
      ) {
        errors.push(Error('你输入的不是电子邮箱地址也不是合法的用户名'))
      }
      callback(errors)
    },
  },
]
