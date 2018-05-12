import { model } from 'dva-hot'
import nanoid from 'nanoid'
import * as services from '~/app/services/card'
import commonModel from '~/app/utils/commonModel'
import { subscribe } from '~/app/utils/socket'

const handlers = {
  'card removed': (socket, dispatch, data) => {
    dispatch({
      type: 'removeLocally',
      payload: data,
    })
  },
  'card created': (socket, dispatch, data) => {
    dispatch({
      type: 'createLocally',
      payload: data,
    })
  },
}

const cardModel = commonModel('cards')({
  state: {},
  reducers: {},
  subscriptions: {
    socket: ({ dispatch }) => subscribe(handlers, dispatch),
  },
  effects: {
    *removeLocally({ payload }, { put }) {
      yield put({
        type: 'rm',
        payload: payload.cardId,
      })
      yield put({
        type: 'lists/removeCard',
        payload,
      })
    },
    *remove({ payload }, { put, call }) {
      yield put({
        type: 'removeLocally',
        payload,
      })
      yield call(services.remove, payload)
    },
    *createLocally({ payload: card }, { put }) {
      yield put({
        type: 'save',
        payload: {
          [card.id]: card,
        },
      })
      yield put({
        type: 'lists/addCard',
        payload: {
          listId: card.listId,
          cardId: card.id,
        },
      })
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
        type: 'createLocally',
        payload: card,
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
