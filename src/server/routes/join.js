import * as ErrorCodes from '~/ErrorCodes'
import { Router } from 'express'
import Schema from 'async-validator'
import models from '../models'
import hashPw from '../utils/hashPw'

const { User } = models

const router = Router()

const validator = new Schema({
  username: { type: 'string', required: true, min: 1 },
  password: { type: 'string', required: true, min: 6 },
  email: { type: 'email', required: true },
})

router.post('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(400).json({ ok: false, code: ErrorCodes.LOGINED })
    return
  }
  const { username, password, email } = req.body
  validator.validate({ username, password, email }, errors => {
    if (errors && errors.length > 0) {
      res.status(400).json({ ok: false, code: ErrorCodes.INVALID_INPUT })
    } else {
      User.create({ username, email, password: hashPw(password) })
        .then(user => {
          req.login(user, e => {
            if (e) {
              next(e)
            } else {
              res.json({ ok: true })
            }
          })
        })
        .catch(next)
    }
  })
})

export default router
