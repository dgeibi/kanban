import merge from 'dva-model-extend'

const reducers = {
  save(state, { payload }) {
    return { ...state, ...payload }
  },
  replace(state, { payload }) {
    return payload
  },
  rm(state, { payload: id }) {
    const newState = { ...state }
    delete newState[id]
    return newState
  },
  patchItem(state, { payload }) {
    const old = state[payload.id]
    return {
      ...state,
      [payload.id]: {
        ...old,
        ...payload,
      },
    }
  },
  patchPartial(state, { payload }) {
    state = Object.assign({}, state)
    Object.keys(payload).forEach(id => {
      const item = { ...state[id], ...payload[id] }
      state[id] = item
    })
    return state
  },
}

const commonModel = namespace => (...models) =>
  merge(
    {
      reducers,
    },
    ...models,
    {
      namespace,
    }
  )

export default commonModel
