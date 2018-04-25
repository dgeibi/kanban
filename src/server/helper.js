import { hashSync, compareSync } from 'bcryptjs'

export const bhash = s => hashSync(s, 10)

export const bcompare = (s, h) => compareSync(s, h)
