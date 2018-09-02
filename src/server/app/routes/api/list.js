import * as list from '~/server/controller/list'

export default ctx => {
  const listRouter = ctx.Router()
  listRouter.get('/list', list.getLists(ctx))
  listRouter.post('/list', list.createList(ctx))
  listRouter
    .param('listId', list.handleListId(ctx))
    .get('/list/:listId', list.getList(ctx))
    .delete('/list/:listId', list.deleteList(ctx))
    .use('/list/:listId', ctx.routers.card(ctx))
  return listRouter
}
