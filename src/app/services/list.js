import request from '../utils/request'

if (process.env.HOT_MODE) {
  module.hot.accept()
}

export const create = data => {
  const { boardId } = data
  return request(`/api/board/${boardId}/list`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
