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
  'card updated': (socket, dispatch, data) => {
    dispatch({
      type: 'updateLocally',
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
      yield put.resolve({
        type: 'rm',
        payload: payload.cardId,
      })
      yield put.resolve({
        type: 'lists/removeCard',
        payload,
      })
    },
    *remove({ payload }, { put, call }) {
      yield put.resolve({
        type: 'removeLocally',
        payload,
      })
      yield call(services.remove, payload)
    },
    *createLocally({ payload: card }, { put }) {
      yield put.resolve({
        type: 'save',
        payload: {
          [card.id]: card,
        },
      })
      yield put.resolve({
        type: 'lists/addCard',
        payload: {
          listId: card.listId,
          cardId: card.id,
        },
      })
    },
    *updateLocally(
      {
        payload: { cardId, data },
      },
      { put, select }
    ) {
      const oldCard = yield select(x => x.cards[cardId])
      yield put({
        type: 'save',
        payload: {
          [cardId]: {
            ...oldCard,
            ...data,
          },
        },
      })
    },
    *update({ payload }, { put, call }) {
      yield put({
        type: 'updateLocally',
        payload,
      })
      yield call(services.update, payload)
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
      yield put.resolve({
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
