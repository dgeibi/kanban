import passport from 'passport'
import LocalStrategy from 'passport-local'

import models from '../models'
import hashPw from '../utils/hashPw'

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