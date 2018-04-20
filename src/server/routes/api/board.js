import { Router } from 'express'
import models from '~/server/models'
import pick from '~/utils/pick'

import autoCatch from 'express-async-handler'
import list from './list'

const b = Router()

const { Board, List, Card } = models

b.post(
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

b.delete(
  '/:boardId/destroy',
  autoCatch(async (req, res) => {
    await Board.destroy({
      where: {
        id: req.params.boardId,
        userId: req.user.id,
      },
    })
    res.end()
  })
)

b.get(
  '/:boardId',
  autoCatch(async (req, res) => {
    const board = await Board.findOne({
      where: {
        id: req.params.boardId,
        userId: req.user.id,
      },
      include: [
        {
          model: List,
          include: [Card],
        },
      ],
      order: [[List, 'index'], [List, Card, 'index']],
    })
    res.json(board.dataValues)
  })
)

const authBoard = autoCatch(async (req, res, next) => {
  const board = await Board.findById(req.params.boardId)
  const has = await req.user.hasBoard(board)
  if (!has) {
    res.status(403).end()
  } else {
    req.board = board
    next()
  }
})

b.use('/:boardId/list', authBoard, list)

export default b
