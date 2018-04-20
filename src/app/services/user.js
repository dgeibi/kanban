import request from '../utils/request'

export const join = info =>
  request('/join', {
    method: 'POST',
    body: JSON.stringify(info),
  })

export const logout = () => request('/logout', { method: 'POST' })

export const login = info =>
  request('/login', {
    method: 'POST',
    body: JSON.stringify(info),
  })
