import { Router } from 'express'
import autoCatch from 'express-async-handler'

import models from '~/server/models'
import pick from '~/utils/pick'
import makeChecking from '~/server/security/makeChecking'
import listRouter from './list'

const boardRouter = Router()

const { Board, List, Card, sequelize } = models

boardRouter.get(
  '/',
  autoCatch(async (req, res) => {
    const boards = await Board.findAll({
      where: {
        userId: req.user.id,
      },
    })
    res.json(boards)
  })
)

boardRouter.post(
  '/create',
  autoCatch(async (req, res) => {
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
)

const findBoardById = makeChecking({
  Model: Board,
  paramKey: 'boardId',
  instKey: 'board',
  check: (req, board) => req.user.hasBoard(board),
})

const userHasBoard = findBoardById({
  attributes: ['id'],
})

boardRouter.delete(
  '/:boardId/destroy',
  userHasBoard,
  autoCatch(async (req, res) => {
    await req.board.destroy()
    res.status(204).end()
  })
)

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

boardRouter.patch(
  '/:boardId/reorder',
  userHasBoard,
  autoCatch(async (req, res) => {
    const { listOrder } = req.body
    if (!Array.isArray(listOrder)) {
      res.status(400).end()
      return
    }
    const transaction = await sequelize.transaction()
    const updateIndex = async (id, index) => {
      const list = await List.findById(id, { transaction, attributes: [] })
      if (!await req.board.hasList(list, { transaction })) {
        throw Error('权限不足')
      }
      await list.update({ index }, { transaction })
    }

    try {
      for (let i = 0; i < listOrder.length; i++) {
        await updateIndex(listOrder[i], i)
      }
    } catch (e) {
      await transaction.rollback()
      res.status(400).end()
      return
    }

    await transaction.commit()
    res.status(204).end()
  })
)

boardRouter.use('/:boardId/list', userHasBoard, listRouter)

export default boardRouter
