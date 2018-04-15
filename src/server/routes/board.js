import { Router } from 'express'
import list from './list'
import models from '../models'

const b = Router()

const { Board } = models

b.post('/create', (req, res) => {
  Board.create({
    title: req.body.title,
  }).then(() => {
    res.send()
  })
})

b.get('/:board_id/destroy', (req, res) => {
  Board.destroy({
    where: {
      id: req.params.board_id,
    },
  }).then(() => {
    res.redirect('/')
  })
})

b.use('/:board_id/list', list)

export default b