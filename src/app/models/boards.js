import { model } from 'dva-hot'
import nanoid from 'nanoid'
import commonModel from '~/app/utils/commonModel'
import * as services from '~/app/services/board'
import { subscribe } from '~/app/utils/socket'

const handlers = {
  'board list-moved': (socket, dispatch, data) =>
    dispatch({
      type: 'patchItem',
      payload: data,
    }),
  'board subscribed': (socket, dispatch, data) => {
    dispatch({
      type: 'patchItem',
      payload: {
        id: data.id,
        subscribed: true,
      },
    })
  },
  'board subscribe failed': () => {
    console.error('subscribe failed')
  },
}

const boardModel = commonModel('boards')({
  state: {},
  reducers: {
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
      yield call(services.create, data)
    },

    *fetchAll(action, { call, put }) {
      const data = yield call(services.fetchAll)
      yield put({
        type: 'save',
        payload: data.boards,
      })
    },

    *fetch(
      {
        payload: { id },
      },
      { call, put, select }
    ) {
      const { result, entities } = yield call(services.fetchLists, id)
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
        type: 'patchItem',
        payload,
      })
      yield call(services.reorder, payload)
    },

    *subscribe({ payload }, { call }) {
      yield call(services.subscribe, payload)
    },
  },
  subscriptions: {
    socket: ({ dispatch }) => subscribe(handlers, dispatch),
  },
})

export default model(module)(boardModel)
