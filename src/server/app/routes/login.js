import Router from 'express-promise-router'
import Schema from 'async-validator'
import passport from 'passport'

import * as validateRules from '~/app/validation/auth'
import { unauenticated } from '~/server/security/auth'

const login = Router()

const validator = new Schema({
  password: validateRules.password,
  emailOrUsername: validateRules.emailOrUsername,
})

const validate = (req, res, next) => {
  const { password, emailOrUsername } = req.body
  validator.validate({ password, emailOrUsername }, errors => {
    if (errors && errors.length > 0) {
      res.status(401).end()
    } else {
      next()
    }
  })
}

const sendUserInfo = (req, res) => {
  const { username, email } = req.user
  res.json({ username, email })
}

login.post(
  '/',
  unauenticated,
  validate,
  passport.authenticate('local'),
  sendUserInfo
)

export default login
