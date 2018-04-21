import crypto from 'crypto'

const secret = process.env.PASSWORD_SECRET

const hash = data =>
  crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex')

export default hash
