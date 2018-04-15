import express from 'express'
import logger from 'morgan'
import passport from 'passport'
import bodyParser from 'body-parser'
import session from 'express-session'
import LocalStrategy from 'passport-local'
import path from 'path'

import * as ErrorCodes from '~/ErrorCodes'
// import favicon from 'serve-favicon'

import models from './models'
import hashPw from './utils/hashPw'

import login from './routes/login'
import join from './routes/join'
import fetchClientData from './fetchClientData'
import render from './render'

const { User } = models

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user)
    })
    .catch(done)
})

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, cb) => {
      User.findOne({
        where: {
          email,
        },
      })
        .then(user => {
          if (user.password === hashPw(password)) {
            cb(null, user)
          } else {
            cb(null, false)
          }
        })
        .catch(cb)
    }
  )
)

const app = express()

app.use(logger('dev'))

app.use('/public', express.static(path.resolve('./dist/public')))

app.use(
  session({
    secret: process.env.SESSION_KEY || 'cat_sjjsj',
    resave: false,
    saveUninitialized: true,
    // cookie: { maxAge: 1000 },
  })
)
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())

// app.use(favicon(`${__dirname}/public/favicon.ico`))

app.use('/join', join)
app.use('/login', login)
app.post('/logout', (req, res) => {
  req.logout()
  res.json({ ok: true })
})

const auth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ ok: false, code: ErrorCodes.UNAUTHORIZED })
  } else {
    next()
  }
}
app.all('/api/*', auth)
app.get('*', fetchClientData, render)

app.use((err, req, res, next) => {
  if (res.headersSent) {
    next(err)
  } else {
    console.error(err)
    res.status(500).json({
      ok: false,
      code: ErrorCodes.SEVER_UNKNOWN,
    })
  }
})

export default app
