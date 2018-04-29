import { Router } from 'express'
import autoCatch from 'express-async-handler'
import models from '~/server/models'
import pick from '~/utils/pick'
import makeChecking from '~/server/security/makeChecking'
import cardRouter from './card'

const listRouter = Router()

const { List, Card } = models

listRouter.get(
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

listRouter.post(
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

const findListById = makeChecking({
  Model: List,
  paramKey: 'listId',
  instKey: 'list',
  check: (req, list) => req.board.hasList(list),
})

listRouter.get(
  '/:listId',
  findListById({
    include: [Card],
    order: [[Card, 'index']],
  }),
  autoCatch((req, res) => {
    res.json(req.list.dataValues)
  })
)

const boardHasList = findListById({
  attributes: ['id'],
})

listRouter.delete(
  '/:listId/destroy',
  boardHasList,
  autoCatch(async (req, res) => {
    await req.list.destroy()
    res.status(204).end()
  })
)

listRouter.use('/:listId/card', boardHasList, cardRouter)

export default listRouter
