import Router from 'express-promise-router'
import models from '~/server/models'
import { pick } from 'lodash'
import { makeChecking } from '~/server/security'
import cardRouter from './card'

const listRouter = Router()

const { List, Card } = models

listRouter.get('/', async (req, res) => {
  const lists = await List.findAll({
    where: {
      boardId: req.board.id,
    },
    include: [Card],
    order: ['index', [Card, 'index']],
  })
  res.json(lists)
})

listRouter.post('/', async (req, res) => {
  const list = Object.assign(
    pick(req.body, ['id', 'index', 'title', 'cards']),
    {
      boardId: req.board.id,
    }
  )
  await List.create(list, {
    include: [Card],
  })
  res.end()
  req.toBoard('list created', list)
})

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
  (req, res) => {
    res.json(req.list.dataValues)
  }
)

const boardHasList = findListById({
  attributes: ['id'],
})

listRouter.delete('/:listId', boardHasList, async (req, res) => {
  await req.list.destroy()
  res.status(204).end()
  req.toBoard('list removed', {
    boardId: req.board.id,
    listId: req.list.id,
  })
})

listRouter.use('/:listId/card', boardHasList, cardRouter)

export default listRouter
