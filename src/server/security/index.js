import passport from 'passport'
import session from 'cookie-session'
import csurf from 'csurf'
import { wrapMiddlewares } from '~/server/helper'
import './initPassport'

export const security = wrapMiddlewares([
  session({
    name: 'ss',
    keys: [process.env.KEY1, process.env.KEY2, process.env.KEY3],
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
  passport.initialize(),
  passport.session(),
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

export const makeChecking = ({
  Model,
  paramKey,
  instKey,
  check,
  onFailure,
}) => (queryOpts = {}) =>
  async function auth(req, res, next) {
    const inst = await Model.findById(req.params[paramKey], queryOpts)
    if (!await check(req, inst)) {
      if (typeof onFailure === 'function') {
        onFailure(req, res)
      } else {
        res.status(403).end()
      }
    } else {
      req[instKey] = inst
      next()
    }
  }
