import passport from 'passport'
import session from 'express-session'
import csurf from 'csurf'

import './initPassport'

export default [
  session({
    secret: process.env.SESSION_KEY || 'cat_sjjsj',
    resave: false,
    saveUninitialized: true,
  }),
  passport.initialize(),
  passport.session(),
  csurf(),
]
