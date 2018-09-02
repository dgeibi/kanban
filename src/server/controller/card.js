export const createCard = ({ models: { Card } }) => async (req, res) => {
  const { text, index, id } = req.body
  await Card.create({
    text,
    index,
    id,
    listId: req.list.id,
  })
  res.end()
  req.toBoard('card created', req.body)
}

export const handleCardId = ({ models: { Card } }) => async (
  req,
  res,
  next,
  id
) => {
  const card = await Card.findById(id)
  if (await req.list.hashCard(card)) {
    req.card = card
    next()
  } else {
    res.status(403).end()
  }
}

export const deleteCard = () => async (req, res) => {
  await req.card.destroy()
  res.status(204).end()
  req.toBoard('card removed', {
    cardId: req.card.id,
    listId: req.list.id,
  })
}
