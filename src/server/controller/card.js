import { pick } from 'lodash'

export const createCard = ({ models: { Card } }) => async (req, res) => {
  await Card.create({
    ...pick(req.body, ['text', 'index', 'id']),
    listId: req.list.id,
  })
  res.status(204).end()
  req.toBoard('card created', req.body)
}

export const handleCardId = ({ models: { Card } }) => async (
  req,
  res,
  next,
  id
) => {
  const card = await Card.findById(id)
  if (await req.list.hasCard(card)) {
    req.card = card
    next()
  } else {
    res.status(403).end()
  }
}

export const updateCard = () => async (req, res) => {
  const payload = pick(req.body, ['text'])
  await req.card.update(payload)
  res.status(204).end()
  req.toBoard('card updated', {
    cardId: req.card.id,
    data: payload,
  })
}

export const deleteCard = () => async (req, res) => {
  await req.card.destroy()
  res.status(204).end()
  req.toBoard('card removed', {
    cardId: req.card.id,
    listId: req.list.id,
  })
}
