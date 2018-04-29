import { schema, normalize } from 'normalizr'
import express from 'express'
import autoCatch from 'express-async-handler'
import models from '~/server/models'
import makeChecking from '~/server/security/makeChecking'

const logined = express.Router()

const { Board, Card, List } = models

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

logined.get('*', async (req, res, next) => {
  const { email, username } = req.user
  req.initialState.user = { email, username }
  next()
})

logined.get(
  '/',
  autoCatch(async (req, res, next) => {
    const boards = await Board.findAll({
      where: {
        userId: req.user.id,
      },
    })
    Object.assign(req.initialState, normalizeBoards(boards))
    next()
  })
)

const findBoardById = makeChecking({
  Model: Board,
  paramKey: 'boardId',
  instKey: 'board',
  check: (req, board) => req.user.hasBoard(board),
  onFailure: (req, res) => {
    res.redirect('/')
  },
})

logined.get(
  '/board/:boardId',
  findBoardById({
    include: {
      model: List,
      include: Card,
    },
    order: [[List, 'index'], [List, Card, 'index']],
  }),
  (req, res, next) => {
    Object.assign(req.initialState, normalizeBoards([req.board]))
    next()
  }
)

export default function fetchClientData(req, res, next) {
  req.initialState = {}
  if (req.isAuthenticated()) {
    logined(req, res, next)
  } else {
    next()
  }
}
