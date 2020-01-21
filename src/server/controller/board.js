import { isPlainObject, pick } from 'lodash'
import updateIndex from '../services/updateIndex'
import { findBoardById } from '../services/board'

export const reorderCards = ({ models }) => async (req, res, next) => {
  const { List, sequelize, Card } = models

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
        const list = await List.findByPk(id, {
          transaction,
          attributes: ['id'],
        })
        if (!(await board.hasList(list, { transaction }))) {
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
    res.status(400).end()
    next(e)
    return
  }
  await transaction.commit()
  req.toBoard('board card-moved', patches)
  res.status(204).end()
}

export const reorderLists = ({ models }) => async (req, res, next) => {
  const { List, sequelize } = models

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
  req.toBoard('board list-moved', req.body)
  res.status(204).end()
}

export const getBoards = ({ models: { Board } }) => async (req, res) => {
  const boards = await Board.findAll({
    where: {
      userId: req.user.id,
    },
  })
  res.json(boards)
}

export const createBoard = ({ models: { Board, List, Card } }) => async (
  req,
  res
) => {
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
  req.toUser('board created', req.body)
  res.status(204).end()
}

export const handleBoardId = ({ models: { Board } }) => async (
  req,
  res,
  next,
  id
) => {
  const inst = await Board.findByPk(id)
  if (!inst || req.user.id !== inst.userId) {
    res.status(403).end()
  } else {
    req.board = inst
    next()
  }
}

export const getBoard = () => async (req, res) => {
  const inst = await findBoardById(req.board.id)
  res.json(inst)
}

export const deleteBoard = () => async (req, res) => {
  await req.board.destroy()
  res.status(204).end()
  req.toUser('board removed', req.board.id)
}

export const updateBoard = () => async (req, res) => {
  const payload = pick(req.body, ['title'])
  await req.board.update(payload)
  res.status(204).end()
  req.toBoard('board updated', {
    boardId: req.board.id,
    data: payload,
  })
}
