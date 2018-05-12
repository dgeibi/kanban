import { model } from 'dva-hot'
import nanoid from 'nanoid'
import * as services from '~/app/services/card'
import commonModel from '~/app/utils/commonModel'

const cardModel = commonModel('cards')({
  state: {},
  reducers: {},
  effects: {
    *remove({ payload }, { put, call }) {
      yield put({
        type: 'rm',
        payload: payload.cardId,
      })
      yield put({
        type: 'lists/removeCard',
        payload,
      })
      yield call(services.remove, payload)
    },
    *create(
      {
        payload: { text, listId, boardId },
      },
      { put, select, call }
    ) {
      const card = {
        id: nanoid(),
        text,
        listId,
      }
      yield put({
        type: 'save',
        payload: {
          [card.id]: card,
        },
      })
      yield put({
        type: 'lists/addCard',
        payload: {
          listId,
          cardId: card.id,
        },
      })
      const index = yield select(x => x.lists[listId].cards.indexOf(card.id))
      yield call(services.create, {
        ...card,
        boardId,
        index,
      })
    },
  },
})

export default model(module)(cardModel)
