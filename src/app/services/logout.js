import request from '../utils/request'

export default function logout() {
  return request('/logout', { method: 'POST' })
}
