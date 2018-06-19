import Router from 'express-promise-router'
import Schema from 'async-validator'

import * as validateRules from '~/app/validation/auth'
import { unauenticated } from '~/server/security'
import models from '~/server/models'

const { User } = models

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
  const user = User.build(req.userInput)
  await user.save()
  const { username, email, id } = user
  const _user = { username, email, id }
  req.login(_user, e => {
    if (e) {
      next(e)
    } else {
      res.json(_user)
    }
  })
}

router.post('/', unauenticated, inputValidate, login)

export default router
