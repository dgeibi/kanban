import { Router } from 'express'
import models from '~/server/models'
import card from './card'


const r = Router()

const { List } = models

r.post('/create', (req, res) => {
  List.create({
    title: req.body.title,
  }).then(() => {
    res.send()
  })
})

r.get('/:list_id/destroy', (req, res) => {
  List.destroy({
    where: {
      id: req.params.list_id,
    },
  }).then(() => {
    res.redirect('/')
  })
})

r.use('/:list_id/card', card)

export default r