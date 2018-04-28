import { model } from 'dva-hot'
import nanoid from 'nanoid'

import { create, fetchAll, fetchLists, reorder } from '~/app/services/board'

export default model(module)({
  namespace: 'boards',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },
    updateListOrder(
      state,
      {
        payload: { id, listOrder },
      }
    ) {
      const boards = { ...state }
      const board = { ...boards[id] }
      board.lists = listOrder
      boards[id] = board

      return boards
    },
    addList(state, { listId, id }) {
      const boards = { ...state }
      const board = { ...boards[id] }
      const lists = (board.lists && [...board.lists]) || []
      lists.push(listId)
      board.lists = lists
      boards[id] = board
      return boards
    },
  },
  effects: {
    *create(
      {
        payload: { title },
      },
      { call, put }
    ) {
      const data = {
        title,
        id: nanoid(),
        lists: [],
      }
      yield put({
        type: 'save',
        payload: {
          [data.id]: data,
        },
      })
      yield call(create, data)
    },
    *fetchAll(action, { call, put }) {
      const data = yield call(fetchAll)
      yield put({
        type: 'save',
        payload: data.boards,
      })
    },

    *fetch({ id }, { call, put, select }) {
      const { result, entities } = yield call(fetchLists, id)
      const board = yield select(x => x.boards[id])

      yield put({
        type: 'save',
        payload: {
          [id]: {
            ...board,
            lists: result,
          },
        },
      })
      yield put({
        type: 'lists/save',
        payload: entities.lists,
      })
      yield put({
        type: 'cards/save',
        payload: entities.cards,
      })
    },
    *reorder({ payload }, { call, put }) {
      yield put({
        type: 'updateListOrder',
        payload,
      })
      yield call(reorder, payload)
    },
  },
})
