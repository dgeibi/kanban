import passport from 'passport'
import LocalStrategy from 'passport-local'
import { compose } from 'compose-middleware'
import normalizeEmail from '~/app/validation/normalizeEmail'
import models from '~/server/models'
import { pcompare } from '~/server/helper'
import normalizeUser from '~/server/services/normalize_user'

export default () => {
  const { User } = models

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findByPk(id, {
      attributes: ['id', 'username', 'email'],
    })
      .then(user => {
        done(null, user)
      })
      .catch(done)
  })

  const findByEmailOrUsername = emailOrUsername => {
    const email = normalizeEmail(emailOrUsername)
    if (email) {
      return User.unscoped().findOne({
        where: {
          email,
        },
      })
    } else {
      return User.unscoped().findOne({
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
            if (!user) {
              return done(null, false)
            } else {
              return pcompare(password, user.password).then(exist => {
                if (exist) {
                  done(null, normalizeUser(user))
                } else {
                  done(null, false)
                }
              })
            }
          })
          .catch(done)
      }
    )
  )

  return compose([passport.initialize(), passport.session()])
}
