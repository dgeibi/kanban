import passport from 'passport'
import session from 'express-session'
import csurf from 'csurf'

import './initPassport'

export default [
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
  passport.initialize(),
  passport.session(),
  csurf(),
]
