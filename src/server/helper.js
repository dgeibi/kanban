import { hashSync, compareSync } from 'bcryptjs'

export const bhash = s => hashSync(s, 10)

export const bcompare = (s, h) => compareSync(s, h)

export function normalizePort(val) {
  const port = Math.floor(val)

  if (Number.isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}
