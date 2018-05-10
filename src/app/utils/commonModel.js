import merge from 'dva-model-extend'

const commonModel = namespace => (...models) =>
  merge(
    {
      reducers: {
        save(state, { payload }) {
          return { ...state, ...payload }
        },
        replace(state, { payload }) {
          return payload
        },
      },

      effects: {
        *patchItem({ payload }, { select, put }) {
          const old = yield select(x => x[namespace][payload.id])
          yield put({
            type: 'save',
            payload: {
              [payload.id]: {
                ...old,
                ...payload,
              },
            },
          })
        },

        *patchPartial({ payload }, { put, select }) {
          const state = { ...(yield select(x => x[namespace])) }
          Object.keys(payload).forEach(id => {
            const item = { ...state[id], ...payload[id] }
            state[id] = item
          })
          yield put({
            type: 'replace',
            payload: state,
          })
        },
      },
    },
    ...models,
    {
      namespace,
    }
  )

export default commonModel
