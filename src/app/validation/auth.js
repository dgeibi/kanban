import isEmail from 'validator/lib/isEmail'

export const username = {
  type: 'string',
  required: true,
  pattern: /^[a-zA-Z0-9_-]{3,30}$/,
  message: '可包含3到30位字母、数字、下划线、减号',
}

export const password = { type: 'string', required: true, min: 6, max: 100 }
export const email = { type: 'email', required: true }

export const emailOrUsername = {
  required: true,
  validator(rule, value, callback) {
    const errors = []
    if (typeof value !== 'string') {
      errors.push(Error('需要输入字符串'))
    } else if (!isEmail(value) && !username.pattern.test(value)) {
      errors.push(Error('请输入正确的邮件地址或用户名'))
    }
    callback(errors)
  },
}
