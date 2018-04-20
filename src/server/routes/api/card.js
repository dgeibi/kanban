import { Router } from 'express'
import models from '~/server/models'
import autoCatch from 'express-async-handler'

const c = Router()

const { Card } = models

c.post(
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

c.delete(
  '/:cardId/destroy',
  autoCatch(async (req, res) => {
    await Card.destroy({
      where: {
        id: req.params.cardId,
        listId: req.list.id,
      },
    })
    res.end()
  })
)

export default c
