import { model } from 'dva-hot'
import { routerRedux } from 'dva/router'
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
      window.location.pathname = '/login'
    },
    *join({ payload: info }, { call, put }) {
      yield call(join, info)
      const { email, username } = info
      yield put({
        type: 'save',
        payload: { email, username },
      })
    },
    *login({ payload: info }, { call, put }) {
      const { email, username } = yield call(login, info)
      yield put({
        type: 'save',
        payload: { email, username },
      })
      yield put(routerRedux.push('/'))
    }
  },
})
