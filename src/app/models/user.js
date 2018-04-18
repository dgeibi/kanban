import { model } from 'dva-hot'
import logout from '../services/logout'

export default model(module)({
  namespace: 'user',
  state: {
    logined: false,
    info: null,
  },
  reducers: {
    logined: (state, action) => ({
      logined: true,
      info: action.info,
    }),
  },
  effects: {
    *logout(action, { call }) {
      const result = yield call(logout)
      if (result.ok) {
        window.location.pathname = '/login'
      } else {
        //
      }
    },
  },
})
