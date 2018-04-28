import { Router } from 'express'
import autoCatch from 'express-async-handler'
import models from '~/server/models'
import pick from '~/utils/pick'
import card from './card'

const r = Router()

const { List, Card } = models

r.get(
  '/',
  autoCatch(async (req, res) => {
    const lists = await List.findAll({
      where: {
        boardId: req.board.id,
      },
      include: [Card],
      order: ['index', [Card, 'index']],
    })
    res.json(lists)
  })
)

r.post(
  '/create',
  autoCatch(async (req, res) => {
    await List.create(
      Object.assign(pick(req.body, ['id', 'index', 'title', 'cards']), {
        boardId: req.board.id,
      }),
      {
        include: [Card],
      }
    )
    res.end()
  })
)

r.get(
  '/:listId',
  autoCatch(async (req, res) => {
    const list = await List.findOne({
      where: {
        id: req.params.listId,
        boardId: req.board.id,
      },
      include: [Card],
      order: [[Card, 'index']],
    })
    res.json(list.dataValues)
  })
)

r.delete(
  '/:listId/destroy',
  autoCatch(async (req, res) => {
    await List.destroy({
      where: {
        id: req.params.listId,
        boardId: req.board.id,
      },
    })
    res.end()
  })
)

const authList = autoCatch(async (req, res, next) => {
  const list = await List.findById(req.params.listId)
  const has = await req.board.hasList(list)
  if (!has) {
    res.status(403).end()
  } else {
    req.list = list
    next()
  }
})

r.use('/:listId/card', authList, card)

export default r
