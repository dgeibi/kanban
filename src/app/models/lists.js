import { model } from 'dva-hot'
import nanoid from 'nanoid'
import { create } from '~/app/services/list'

export default model(module)({
  namespace: 'lists',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },
    reorderCards(state, { payload: cardOrders }) {
      const lists = { ...state }

      Object.keys(cardOrders).forEach(id => {
        const list = { ...lists[id] }
        list.cards = cardOrders[id]
        lists[id] = list
      })

      return lists
    },
    addCard(state, { cardId, id }) {
      const lists = { ...state }
      const list = { ...lists[id] }
      const cards = (list.cards && [...list.cards]) || []
      cards.push(cardId)
      list.cards = cards
      lists[id] = list
      return lists
    },
  },
  effects: {
    *create(
      {
        payload: { title, boardId },
      },
      { put, select, call }
    ) {
      const listId = nanoid()
      const list = {
        title,
        id: listId,
        boardId,
        cards: [],
      }
      yield put({
        type: 'save',
        payload: {
          [listId]: list,
        },
      })
      yield put({
        type: 'boards/addList',
        id: boardId,
        listId,
      })
      const index = yield select(x => x.boards[boardId].lists.indexOf(listId))
      yield call(create, {
        ...list,
        index,
      })
    },
  },
})
