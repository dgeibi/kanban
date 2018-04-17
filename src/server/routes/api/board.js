import { Router } from 'express'
import models from '~/server/models'
import trulyArray from '~/utils/trulyArray'
import list from './list'

const b = Router()

const { Board, List } = models

b.post('/create', (req, res, next) => {
  const { id, title, Lists } = req.body
  Board.create(
    {
      id,
      title,
      Lists,
      UserId: req.user.id,
    },
    {
      include: trulyArray([
        Lists && {
          association: Board.List,
          include: [List.Card],
        },
      ]),
    }
  )
    .then(() => {
      res.end()
    })
    .catch(next)
})

b.delete('/:BoardId/destroy', (req, res, next) => {
  Board.destroy({
    where: {
      id: req.params.BoardId,
    },
  })
    .then(() => {
      res.end()
    })
    .catch(next)
})

b.get('/:BoardId', (req, res, next) => {
  Board.findById(req.params.BoardId, {
    include: [
      {
        association: Board.List,
        include: [List.Card],
      },
    ],
  })
    .then(({ dataValues }) => {
      if (dataValues.UserId !== req.user.id) {
        res.status(403).end()
      } else {
        res.json(dataValues)
      }
    })
    .catch(next)
})

b.use('/:BoardId/list', list)

export default b
