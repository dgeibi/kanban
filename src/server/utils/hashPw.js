import crypto from 'crypto'

const { PASSWORD_SECRET } = process.env

const hash = data =>
  crypto
    .createHmac('sha256', PASSWORD_SECRET)
    .update(data)
    .digest('hex')

export default hash