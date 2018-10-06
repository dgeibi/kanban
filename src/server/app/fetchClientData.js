import { schema, normalize } from 'normalizr'
import Router from 'express-promise-router'
import models from '~/server/models'
import { findBoardById } from '~/server/services/board'
import { handleBoardId } from '~/server/controller/board'

const { Board } = models
const { Entity } = schema

const normalizeBoards = boards => {
  const card = new Entity('cards')
  const list = new Entity('lists', {
    cards: [card],
  })
  const board = new Entity('boards', {
    lists: [list],
  })
  return normalize(boards.map(x => x.toJSON()), [board]).entities
}

export default () => {
  const logined = Router()

  logined
    .get('*', (req, res, next) => {
      const { email, username, id } = req.user
      req.initialState = req.initialState || {}
      req.initialState.user = { email, username, id }
      next()
    })
    .get('*', async (req, res, next) => {
      const boards = await Board.findAll({
        where: {
          userId: req.user.id,
        },
      })
      Object.assign(req.initialState, normalizeBoards(boards))
      next()
    })
    .param('boardId', handleBoardId({ models }))
    .get('/board/:boardId', async (req, res, next) => {
      const board = await findBoardById(req.params.boardId)
      if (!board) {
        res.status(403).end()
        return
      }
      const { boards } = req.initialState
      const state = normalizeBoards([req.board])
      Object.assign(boards, state.boards)
      Object.assign(req.initialState, state, { boards })
      next()
    })

  return function fetchClientData(req, res, next) {
    req.initialState = {}
    if (req.isAuthenticated()) {
      logined(req, res, next)
    } else {
      next()
    }
  }
}
