import Router from 'express-promise-router'

import { pick } from 'lodash'
import models from '~/server/models'
import makeChecking from '~/server/security/makeChecking'
import { io } from '~/server/server'

import listRouter from './list'

const boardRouter = Router()

const { Board, List, Card, sequelize } = models

boardRouter.get('/', async (req, res) => {
  const boards = await Board.findAll({
    where: {
      userId: req.user.id,
    },
  })
  res.json(boards)
})

boardRouter.post('/', async (req, res) => {
  await Board.create(
    Object.assign(pick(req.body, ['id', 'title', 'lists']), {
      userId: req.user.id,
    }),
    {
      include: [
        {
          model: List,
          include: [Card],
        },
      ],
    }
  )
  res.end()
})

const findBoardById = makeChecking({
  Model: Board,
  paramKey: 'boardId',
  instKey: 'board',
  check: (req, board) => req.user.hasBoard(board),
})

const userHasBoard = findBoardById({
  attributes: ['id'],
})

boardRouter.delete('/:boardId', userHasBoard, async (req, res) => {
  await req.board.destroy()
  res.status(204).end()
})

boardRouter.get(
  '/:boardId',
  findBoardById({
    include: [
      {
        model: List,
        include: [Card],
      },
    ],
    order: [[List, 'index'], [List, Card, 'index']],
  }),
  (req, res) => {
    res.json(req.board)
  }
)

boardRouter.patch('/:boardId/reorder', userHasBoard, async (req, res, next) => {
  const { board } = req
  const { lists: listIds } = req.body
  if (!Array.isArray(listIds)) {
    res.status(400).end()
    return
  }
  const transaction = await sequelize.transaction()
  const updateIndex = async (id, index) => {
    const list = await List.findById(id, { transaction, attributes: ['id'] })
    if (!await board.hasList(list, { transaction })) {
      throw Error('权限不足')
    }
    await list.update({ index }, { transaction })
  }

  try {
    for (let i = 0; i < listIds.length; i++) {
      await updateIndex(listIds[i], i)
    }
  } catch (e) {
    await transaction.rollback()
    res.status(400).end()
    next(e)
    return
  }

  await transaction.commit()

  if (req.query.sid && io.sockets.sockets[req.query.sid]) {
    io.sockets.sockets[req.query.sid]
      .to(`board ${board.id}`)
      .emit('board list-moved', req.body)
  } else {
    console.log('sync failed')
  }
  res.status(204).end()
})

boardRouter.use('/:boardId/list', userHasBoard, listRouter)

export default boardRouter
