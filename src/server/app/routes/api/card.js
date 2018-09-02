import * as card from '~/server/controller/card'

export default ctx => {
  const cardRouter = ctx.Router()

  cardRouter.post('/', card.createCard(ctx))
  cardRouter
    .param('cardId', card.handleCardId(ctx))
    .delete('/:cardId', card.deleteCard(ctx))

  return cardRouter
}
