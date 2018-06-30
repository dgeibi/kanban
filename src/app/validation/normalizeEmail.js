import isEmail from 'validator/lib/isEmail'
import normalizeEmailImpl from 'validator/lib/normalizeEmail'

export default function normalizeEmail(email) {
  if (typeof email !== 'string') return false
  if (!isEmail(email)) return false
  return normalizeEmailImpl(email)
}
