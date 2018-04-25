import passport from 'passport'
import LocalStrategy from 'passport-local'

import isEmail from 'validator/lib/isEmail'
import normalizeEmail from 'validator/lib/normalizeEmail'
import { bcompare } from '~/server/helper'

import models from '../models'

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

const findByEmailOrUsername = emailOrUsername => {
  if (isEmail(emailOrUsername)) {
    return User.findOne({
      where: {
        email: normalizeEmail(emailOrUsername),
      },
    })
  } else {
    return User.findOne({
      where: {
        username: emailOrUsername,
      },
    })
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'emailOrUsername',
      passwordField: 'password',
    },
    (emailOrUsername, password, done) => {
      findByEmailOrUsername(emailOrUsername)
        .then(user => {
          if (bcompare(password, user.password)) {
            done(null, user)
          } else {
            done(null, false)
          }
        })
        .catch(done)
    }
  )
)
