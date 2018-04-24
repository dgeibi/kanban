import models from '~/server/models'
import { schema, normalize } from 'normalizr'
import express from 'express'
import autoCatch from 'express-async-handler'

const logined = express.Router()

const { Board, Card, List } = models

const { Entity } = schema

const card = new Entity('cards')
const list = new Entity('lists', {
  cards: [card],
})
const board = new Entity('boards', {
  lists: [list],
})

const normalizeBoards = boards =>
  normalize(boards.map(x => x.toJSON()), [board]).entities

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

logined.get('/board/:boardId', (req, res, next) => {
  Board.findOne({
    where: {
      id: req.params.boardId,
      userId: req.user.id,
    },
    include: {
      model: List,
      include: Card,
    },
    order: [[List, 'index'], [List, Card, 'index']],
  })
    .then(x => {
      Object.assign(req.initialState, normalizeBoards([x]))
      next()
    })
    .catch(e => {
      res.status(403).end()
      next(e)
    })
})

export default function fetchClientData(req, res, next) {
  req.initialState = {}
  if (req.isAuthenticated()) {
    logined(req, res, next)
  } else {
    next()
  }
}
