import { Router } from 'express'
import Schema from 'async-validator'
import autoCatch from 'express-async-handler'

import * as validateRules from '~/app/validation/auth'
import { unauenticated } from '../security/auth'

import models from '../models'

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

const login = autoCatch(async (req, res, next) => {
  const user = await User.create(req.userInput)
  req.login(user, e => {
    if (e) {
      next(e)
    } else {
      const { username, email } = user
      res.json({ username, email })
    }
  })
})

router.post('/', unauenticated, inputValidate, login)

export default router
