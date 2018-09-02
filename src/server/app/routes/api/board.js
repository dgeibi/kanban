import * as board from '~/server/controller/board'

export default ctx => {
  const router = ctx.Router()

  router.get('/board', board.getBoards(ctx))
  router.post('/board', board.createBoard(ctx))
  router
    .param('boardId', board.handleBoardId(ctx))
    .get('/board/:boardId', board.getBoard(ctx))
    .delete('/board/:boardId', board.deleteBoard(ctx))
    .patch('/board/:boardId/reorderCards', board.reorderCards(ctx))
    .patch('/board/:boardId/reorderLists', board.reorderLists(ctx))
    .use('/board/:boardId', ctx.routers.list(ctx))

  return router
}
