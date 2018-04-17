import { Router } from 'express'
import models from '~/server/models'
import list from './list'

const b = Router()

const { Board, List, Card } = models

b.post('/create', (req, res, next) => {
  const { id, title } = req.body
  Board.create({
    id,
    title,
    UserId: req.user.id,
  })
    .then(() => {
      res.end()
    })
    .catch(next)
})

b.delete('/:board_id/destroy', (req, res, next) => {
  Board.destroy({
    where: {
      id: req.params.board_id,
    },
  })
    .then(() => {
      res.end()
    })
    .catch(next)
})

b.get('/:board_id', (req, res, next) => {
  Board.findAll({
    where: {
      id: req.params.board_id,
    },
    include: [
      {
        model: List,
        include: [
          {
            model: Card,
          },
        ],
      },
    ],
  })
    .then(([{ dataValues }]) => {
      if (dataValues.UserId !== req.user.id) {
        res.status(403).end()
      } else {
        res.json(dataValues)
      }
    })
    .catch(next)
})

b.use('/:board_id/list', list)

export default b
