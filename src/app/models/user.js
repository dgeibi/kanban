import { message } from 'antd'
import { model } from 'dva-hot'
import { join, login, logout } from '../services/user'

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
      let data
      try {
        data = yield call(login, info)
      } catch (e) {
        message.error('登录失败，请检查你的用户名和密码')
      }
      if (data) {
        yield put({
          type: 'boards/fetchAll',
        })
        yield put({
          type: 'save',
          payload: data,
        })
      }
    },
  },
})
