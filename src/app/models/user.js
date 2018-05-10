import { message } from 'antd'
import { model } from 'dva-hot'
import { connect } from '~/app/utils/socket'
import { join, login, logout } from '../services/user'

export default model(module)({
  namespace: 'user',
  state: null,
  reducers: {
    replace(state, { payload }) {
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
      yield call(connect)
      yield put({
        type: 'replace',
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
      yield call(connect)
      if (data) {
        yield put({
          type: 'boards/fetchAll',
        })
        yield put({
          type: 'replace',
          payload: data,
        })
      }
    },
  },
})
