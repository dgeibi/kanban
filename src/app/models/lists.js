import { model } from 'dva-hot'
import nanoid from 'nanoid'
import produce from 'immer'
import * as services from '~/app/services/list'
import commonModel from '~/app/utils/commonModel'
import { subscribe } from '~/app/utils/socket'

const handlers = {
  'list removed': (socket, dispatch, data) => {
    dispatch({
      type: 'removeLocally',
      payload: data,
    })
  },
  'list created': (socket, dispatch, data) => {
    dispatch({
      type: 'createLocally',
      payload: data,
    })
  },
}

const listModel = commonModel('lists')({
  state: {},
  subscriptions: {
    socket: ({ dispatch }) => subscribe(handlers, dispatch),
  },
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
    *removeLocally({ payload }, { put }) {
      yield put.resolve({
        type: 'rm',
        payload: payload.listId,
      })
      yield put.resolve({
        type: 'boards/removeList',
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
    *createLocally({ payload: list }, { put }) {
      const { id: listId, boardId } = list

      yield put.resolve({
        type: 'save',
        payload: {
          [listId]: list,
        },
      })
      yield put.resolve({
        type: 'boards/addList',
        payload: {
          boardId,
          listId,
        },
      })
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
      yield put.resolve({
        type: 'createLocally',
        payload: list,
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
