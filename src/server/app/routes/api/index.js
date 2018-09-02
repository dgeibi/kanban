import express from 'express'
import Router from 'express-promise-router'
import board from './board'
import list from './list'
import card from './card'

import models from '~/server/models'
import bindSocket from '~/server/middleware/bind-socket'
import { auenticated } from '~/server/security'

export default () => {
  const router = express.Router()
  const ctx = {
    routers: {
      board,
      list,
      card,
    },
    models,
    Router,
  }
  router.use('/api', auenticated, bindSocket(), board(ctx))
  return router
}
