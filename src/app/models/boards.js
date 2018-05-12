import { model } from 'dva-hot'
import nanoid from 'nanoid'
import produce from 'immer'
import { routerRedux } from 'dva/router'
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

  'board card-moved': (socket, dispatch, patches) =>
    dispatch({
      type: 'lists/patchPartial',
      payload: patches,
    }),

  'board subscribe failed': () => {
    console.error('subscribe failed')
  },
}

const boardModel = commonModel('boards')({
  state: {},
  reducers: {
    addList(
      state,
      {
        payload: { listId, boardId },
      }
    ) {
      if (!state[boardId]) throw Error('board not found')
      return produce(state, draft => {
        if (!draft[boardId].lists) {
          draft[boardId].lists = []
        }
        draft[boardId].lists.push(listId)
      })
    },
    removeList(
      state,
      {
        payload: { listId, boardId },
      }
    ) {
      return produce(state, draft => {
        if (!draft[boardId]) throw Error('board not found')
        const idx = draft[boardId].lists && draft[boardId].lists.indexOf(listId)
        if (idx < 0) throw Error('card not found')
        draft[boardId].lists.splice(idx, 1)
      })
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

    *reorderLists({ payload }, { call, put }) {
      yield put({
        type: 'patchItem',
        payload,
      })
      yield call(services.reorderLists, payload)
    },

    *reorderCards({ payload }, { put, call }) {
      const { patches } = payload

      yield put({
        type: 'lists/patchPartial',
        payload: patches,
      })
      yield call(services.reorderCards, payload)
    },

    *subscribe({ payload }, { call }) {
      yield call(services.subscribe, payload)
    },

    *remove({ payload }, { call, put }) {
      yield put(routerRedux.push('/'))
      yield put({
        type: 'rm',
        payload: payload.boardId,
      })
      yield call(services.remove, payload)
    },
  },
  subscriptions: {
    socket: ({ dispatch }) => subscribe(handlers, dispatch),
  },
})

export default model(module)(boardModel)
