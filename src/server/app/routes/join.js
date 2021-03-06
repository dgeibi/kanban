import Router from 'express-promise-router'
import Schema from 'async-validator'

import * as validateRules from '~/app/validation/auth'
import { phash } from '~/server/helper'
import { unauenticated } from '~/server/security'
import models from '~/server/models'
import normalizeEmail from '~/app/validation/normalizeEmail'
import normalizeUser from '~/server/services/normalize_user'

const { User } = models

export default () => {
  const router = Router()

  const validator = new Schema({
    username: validateRules.username,
    email: validateRules.email,
    password: validateRules.password,
  })

  const inputValidate = (req, res, next) => {
    const { username, password, email } = req.body
    const userInput = { username, password, email }
    validator.validate(userInput, errors => {
      if (errors && errors.length > 0) {
        res.status(400).end()
      } else {
        req.userInput = userInput
        next()
      }
    })
  }

  const login = async (req, res, next) => {
    const user = User.build({
      ...req.userInput,
      email: normalizeEmail(req.userInput.email),
      password: await phash(req.userInput.password),
    })
    await user.save()
    const _user = normalizeUser(user)

    req.login(_user, e => {
      if (e) {
        next(e)
      } else {
        res.json(_user)
      }
    })
  }

  router.post('/join', unauenticated, inputValidate, login)

  return router
}
