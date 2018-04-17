import { Router } from 'express'
import models from '~/server/models'
import autoCatch from 'express-async-handler'

/* merge req.params.BoardId, ListId */
const c = Router({ mergeParams: true })

const { Card } = models

c.post(
  '/create',
  autoCatch(async (req, res) => {
    const { ListId } = req.params
    const { text, index, id } = req.body
    await Card.create({
      text,
      index,
      id,
      ListId,
    })
    res.end()
  })
)

c.delete(
  '/:CardId/destroy',
  autoCatch(async (req, res) => {
    await Card.destroy({
      where: {
        id: req.params.CardId,
      },
    })
    res.end()
  })
)

export default c
