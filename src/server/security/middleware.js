import passport from 'passport'
import session from 'express-session'
import csurf from 'csurf'
import wrapMiddlewares from '~/server/utils/wrapMiddlewares'

import './initPassport'

export default wrapMiddlewares([
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
])
