import session from 'cookie-session'
import csurf from 'csurf'
import { compose } from 'compose-middleware'

import passport from './passport'

export const security = compose([
  session({
    name: 'ss',
    keys: [process.env.KEY1, process.env.KEY2, process.env.KEY3],
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
  passport(),
  csurf(),
])

export const auenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).end()
  } else {
    next()
  }
}

export const unauenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(401).end()
  } else {
    next()
  }
}
