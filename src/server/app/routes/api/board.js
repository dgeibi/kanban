import Router from 'express-promise-router'

import { pick, isPlainObject } from 'lodash'
import models from '~/server/models'
import makeChecking from '~/server/security/makeChecking'

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

const updateIndex = async ({
  transaction,
  permissionCheck,
  Model,
  ids,
  extra,
}) => {
  if (!Array.isArray(ids)) throw Error('ids should be array')

  const update = async (id, index) => {
    const m = await Model.findById(id, { transaction, attributes: ['id'] })
    if (!await permissionCheck(m)) {
      throw Error('权限不足')
    }
    await m.update({ index, ...extra }, { transaction })
  }

  for (let index = 0; index < ids.length; index++) {
    await update(ids[index], index)
  }
}

boardRouter.patch(
  '/:boardId/reorderCards',
  userHasBoard,
  async (req, res, next) => {
    const { board } = req
    const patches = req.body
    if (!isPlainObject(patches)) {
      res.status(400).end()
      return
    }
    const transaction = await sequelize.transaction()

    const findLists = listids =>
      Promise.all(
        listids.map(async id => {
          const list = await List.findById(id, {
            transaction,
            attributes: ['id'],
          })
          if (!await board.hasList(list, { transaction })) {
            throw Error('权限不足')
          }
          return list
        })
      )
    try {
      const listIds = Object.keys(patches)
      const lists = await findLists(listIds)
      const bolongsToSomeList = async card => {
        for (const list of lists) {
          if (await list.hasCard(card, { transaction })) {
            return true
          }
        }
        return false
      }
      for (const id of listIds) {
        await updateIndex({
          Model: Card,
          permissionCheck: bolongsToSomeList,
          transaction,
          ids: patches[id].cards,
          extra: {
            listId: id,
          },
        })
      }
    } catch (e) {
      await transaction.rollback()
      console.log(patches)
      res.status(400).end()
      next(e)
      return
    }
    await transaction.commit()
    if (req.ioSocket) {
      req.ioSocket.to(`board ${board.id}`).emit('board card-moved', patches)
    }
    res.status(204).end()
  }
)

boardRouter.patch(
  '/:boardId/reorderLists',
  userHasBoard,
  async (req, res, next) => {
    const { board } = req
    const { lists: listIds } = req.body
    if (!Array.isArray(listIds)) {
      res.status(400).end()
      return
    }
    const transaction = await sequelize.transaction()
    try {
      await updateIndex({
        ids: listIds,
        transaction,
        permissionCheck: list => board.hasList(list, { transaction }),
        Model: List,
      })
    } catch (e) {
      await transaction.rollback()
      res.status(400).end()
      next(e)
      return
    }

    await transaction.commit()
    if (req.ioSocket) {
      req.ioSocket.to(`board ${board.id}`).emit('board list-moved', req.body)
    }
    res.status(204).end()
  }
)

boardRouter.use('/:boardId/list', userHasBoard, listRouter)

export default boardRouter
