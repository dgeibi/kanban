import { model } from 'dva-hot'
import nanoid from 'nanoid'
import produce from 'immer'
import * as services from '~/app/services/list'
import commonModel from '~/app/utils/commonModel'

const listModel = commonModel('lists')({
  state: {},
  reducers: {
    addCard(
      state,
      {
        payload: { cardId, listId },
      }
    ) {
      if (!state[listId]) throw Error('list not found')
      return produce(state, lists => {
        if (!lists[listId].cards) {
          lists[listId].cards = []
        }
        lists[listId].cards.push(cardId)
      })
    },
    removeCard(
      state,
      {
        payload: { cardId, listId },
      }
    ) {
      return produce(state, lists => {
        if (!lists[listId]) throw Error('list not found')
        const idx = lists[listId].cards && lists[listId].cards.indexOf(cardId)
        if (idx < 0) throw Error('card not found')
        lists[listId].cards.splice(idx, 1)
      })
    },
  },
  effects: {
    *remove({ payload }, { put, call }) {
      yield put({
        type: 'rm',
        payload: payload.listId,
      })
      yield put({
        type: 'boards/removeList',
        payload,
      })
      yield call(services.remove, payload)
    },
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
        payload: {
          boardId,
          listId,
        },
      })
      const index = yield select(x => x.boards[boardId].lists.indexOf(listId))
      yield call(services.create, {
        ...list,
        index,
      })
    },
  },
})

export default model(module)(listModel)
