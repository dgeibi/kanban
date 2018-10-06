import Router from 'express-promise-router'
import * as board from '~/server/controller/board'
import * as list from '~/server/controller/list'
import * as card from '~/server/controller/card'

export default ctx => {
  const router = Router()

  router.get('/board', board.getBoards(ctx))
  router.post('/board', board.createBoard(ctx))
  router
    .param('boardId', board.handleBoardId(ctx))
    .get('/board/:boardId', board.getBoard(ctx))
    .delete('/board/:boardId', board.deleteBoard(ctx))
    .patch('/board/:boardId/reorderCards', board.reorderCards(ctx))
    .patch('/board/:boardId/reorderLists', board.reorderLists(ctx))

  router.get('/board/:boardId/list', list.getLists(ctx))
  router.post('/board/:boardId/list', list.createList(ctx))
  router
    .param('listId', list.handleListId(ctx))
    .get('/board/:boardId/list/:listId', list.getList(ctx))
    .delete('/board/:boardId/list/:listId', list.deleteList(ctx))

  router.post('/board/:boardId/list/:listId/card', card.createCard(ctx))
  router
    .param('cardId', card.handleCardId(ctx))
    .delete('/board/:boardId/list/:listId/card/:cardId', card.deleteCard(ctx))

  return router
}
