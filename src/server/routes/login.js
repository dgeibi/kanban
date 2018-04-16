import { Router } from 'express'
import Schema from 'async-validator'
import passport from 'passport'
import * as ErrorCodes from '~/ErrorCodes'

const login = Router()

const validator = new Schema({
  password: { type: 'string', required: true, min: 6 },
  email: { type: 'email', required: true },
})

const validateLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(400).json({ ok: false, code: ErrorCodes.LOGINED })
  } else {
    const { password, email } = req.body
    validator.validate({ password, email }, errors => {
      if (errors && errors.length > 0) {
        console.log(errors)
        res.status(400).json({ ok: false, code: ErrorCodes.INVALID_INPUT })
      } else {
        next()
      }
    })
  }
}

const sendUserInfo = (req, res) => {
  const { username, email } = req.user
  res.json({
    ok: true,
    info: { username, email },
  })
}

login.post('/', validateLogin, passport.authenticate('local'), sendUserInfo)

export default login
