import passport from 'passport'
import LocalStrategy from 'passport-local'

import models from '../models'
import hashPw from './hashPw'

const { User } = models

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findAll({
    where: {
      id,
    },
    attributes: ['id', 'username', 'email'],
  })
    .then(([{ dataValues }]) => {
      done(null, dataValues)
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
