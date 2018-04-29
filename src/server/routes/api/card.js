import { Router } from 'express'
import autoCatch from 'express-async-handler'
import models from '~/server/models'
import makeChecking from '~/server/security/makeChecking'

const cardRouter = Router()

const { Card } = models

cardRouter.post(
  '/create',
  autoCatch(async (req, res) => {
    const { text, index, id } = req.body
    await Card.create({
      text,
      index,
      id,
      listId: req.list.id,
    })
    res.end()
  })
)

const findCardById = makeChecking({
  Model: Card,
  paramKey: 'cardId',
  instKey: 'card',
  check: (req, card) => req.list.hasCard(card),
})

const listHasCard = findCardById({
  attributes: ['id'],
})

cardRouter.delete(
  '/:cardId/destroy',
  listHasCard,
  autoCatch(async (req, res) => {
    await req.card.destroy()
    res.status(204).end()
  })
)

export default cardRouter
