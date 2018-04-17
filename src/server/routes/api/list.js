import { Router } from 'express'
import autoCatch from 'express-async-handler'
import models from '~/server/models'
import trulyArray from '~/utils/trulyArray'
import card from './card'

/* merge req.params.BoardId */
const r = Router({ mergeParams: true })

const { List } = models

r.post(
  '/create',
  autoCatch(async (req, res) => {
    const { id, index, title, Cards } = req.body
    await List.create(
      {
        id,
        title,
        Cards,
        index,
        BoardId: req.params.BoardId,
      },
      {
        include: trulyArray([
          List.Board,
          Cards && {
            association: List.Card,
          },
        ]),
      }
    )
    res.end()
  })
)

r.get(
  '/:ListId',
  autoCatch(async (req, res) => {
    const list = await List.findById(req.params.ListId, {
      include: [
        {
          association: List.Card,
        },
      ],
    })
    res.json(list.dataValues)
  })
)

r.delete(
  '/:ListId/destroy',
  autoCatch(async (req, res) => {
    await List.destroy({
      where: {
        id: req.params.ListId,
      },
    })
    res.end()
  })
)

r.use('/:ListId/card', card)

export default r
