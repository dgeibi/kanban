import express from 'express'
import board from './board'

import models from '~/server/models'
import bindSocket from '~/server/middleware/bind-socket'
import { auenticated } from '~/server/security'

export default () => {
  const router = express.Router()
  router.use(
    '/api',
    auenticated,
    bindSocket(),
    board({
      models,
    })
  )
  return router
}
