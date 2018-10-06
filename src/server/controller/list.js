import { pick } from 'lodash'

export const getLists = ({ models: { List, Card } }) => async (req, res) => {
  const lists = await List.findAll({
    where: {
      boardId: req.board.id,
    },
    include: [Card],
    order: ['index', [Card, 'index']],
  })
  res.json(lists)
}

export const createList = ({ models: { List, Card } }) => async (req, res) => {
  const list = Object.assign(
    pick(req.body, ['id', 'index', 'title', 'cards']),
    {
      boardId: req.board.id,
    }
  )
  await List.create(list, {
    include: [Card],
  })
  res.status(204).end()
  req.toBoard('list created', list)
}

export const handleListId = ({ models: { List } }) => async (
  req,
  res,
  next,
  id
) => {
  const list = await List.findById(id, {
    attributes: ['id'],
  })
  if (!(await req.board.hasList(list))) {
    res.status(403).end()
  } else {
    req.list = list
    next()
  }
}

export const getList = ({ models: { List, Card } }) => async (req, res) => {
  const list = await List.findById(req.list.id, {
    include: [Card],
    order: [[Card, 'index']],
  })
  if (list) {
    res.json(list)
  } else {
    res.status(403).end()
  }
}

export const updateList = () => async (req, res) => {
  const payload = pick(req.body, ['title'])
  await req.list.update(payload)
  res.status(204).end()
  req.toBoard('list updated', {
    listId: req.list.id,
    ...payload,
  })
}

export const deleteList = () => async (req, res) => {
  await req.list.destroy()
  res.status(204).end()
  req.toBoard('list removed', {
    boardId: req.board.id,
    listId: req.list.id,
  })
}
