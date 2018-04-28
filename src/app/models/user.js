import { model } from 'dva-hot'
import { logout, join, login } from '../services/user'

export default model(module)({
  namespace: 'user',
  state: null,
  reducers: {
    save(state, { payload }) {
      return payload
    },
  },
  effects: {
    *logout(action, { call }) {
      yield call(logout)
      window.location.pathname = '/'
    },
    *join({ payload: info }, { call, put }) {
      const data = yield call(join, info)
      yield put({
        type: 'save',
        payload: data,
      })
    },
    *login({ payload: info }, { call, put }) {
      const data = yield call(login, info)
      yield put({
        type: 'boards/fetchAll',
      })
      yield put({
        type: 'save',
        payload: data,
      })
    },
  },
})
