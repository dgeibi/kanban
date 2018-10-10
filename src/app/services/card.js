import request from '../utils/request'

if (process.env.HOT_MODE) {
  module.hot.accept()
}

export const create = data => {
  const { boardId, listId } = data
  return request(`/api/board/${boardId}/list/${listId}/card`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const update = ({ boardId, listId, cardId, data }) =>
  request(`/api/board/${boardId}/list/${listId}/card/${cardId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

export const remove = ({ boardId, listId, cardId }) =>
  request(`/api/board/${boardId}/list/${listId}/card/${cardId}`, {
    method: 'DELETE',
  })
