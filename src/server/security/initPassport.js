import passport from 'passport'
import LocalStrategy from 'passport-local'

import models from '../models'
import hashPw from './hashPw'

const { User } = models

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, {
    attributes: ['id', 'username', 'email'],
  })
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
    (email, password, done) => {
      User.findOne({
        where: {
          email,
        },
      })
        .then(user => {
          if (user.password === hashPw(password)) {
            done(null, user)
          } else {
            done(null, false)
          }
        })
        .catch(done)
    }
  )
)
