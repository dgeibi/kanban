import { schema, normalize } from 'normalizr'
import request from '../utils/request'

if (process.env.HOT_MODE) {
  module.hot.accept()
}

export const create = data =>
  request('/api/board/create', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const fetchLists = id =>
  request(`/api/board/${id}/list`).then(data => {
    const { Entity } = schema
    const card = new Entity('cards')
    const list = new Entity('lists', {
      cards: [card],
    })

    return normalize(data, [list])
  })

export const fetchAll = () =>
  request(`/api/board`).then(data => {
    const { Entity } = schema
    const list = new Entity('lists')
    const board = new Entity('boards', {
      lists: [list],
    })
    return normalize(data, [board]).entities
  })

export const reorder = data =>
  request(`/api/board/${data.id}/reorder`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
