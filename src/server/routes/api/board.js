import { Router } from 'express'
import models from '~/server/models'
import pick from '~/utils/pick'

import autoCatch from 'express-async-handler'
import l from './list'

const b = Router()

const { Board, List, Card, sequelize } = models

b.get(
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
  const board = await Board.findById(req.params.boardId, {
    attributes: ['id'],
  })
  const has = await req.user.hasBoard(board)
  if (!has) {
    res.status(403).end()
  } else {
    req.board = board
    next()
  }
})

b.use('/:boardId/list', authBoard, l)

b.patch(
  '/:boardId/reorder',
  authBoard,
  autoCatch(async (req, res) => {
    const { listOrder } = req.body
    if (!Array.isArray(listOrder)) {
      res.status(400).end()
      return
    }
    const t = await sequelize.transaction()
    const updateIndex = async (id, index) => {
      const list = await List.findById(id, {
        transaction: t,
      })
      if (
        !await req.board.hasList(list, {
          transaction: t,
        })
      ) {
        throw Error('permission not satisfy')
      }
      await list.update(
        { index },
        {
          transaction: t,
        }
      )
    }

    try {
      for (let i = 0; i < listOrder.length; i++) {
        await updateIndex(listOrder[i], i)
      }
    } catch (e) {
      await t.rollback()
      res.status(400).end()
      return
    }
    await t.commit()
    res.status(204).end()
  })
)
export default b
