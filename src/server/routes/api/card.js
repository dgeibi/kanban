import { Router } from 'express'
import models from '~/server/models'

const c = Router()

const { Card } = models

c.post('/create', (req, res) => {
  Card.create({}).then(() => {})
})

c.get('/:card_id/destroy', (req, res) => {
  Card.destroy({
    where: {
      id: req.params.card_id,
    },
  }).then(() => {})
})

export default c