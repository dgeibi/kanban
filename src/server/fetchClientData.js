import models from '~/server/models'

const { Board, Card, List } = models

export default async function fetchClientData(req, res, next) {
  const initialState = {}
  if (req.isAuthenticated()) {
    const { email, username } = req.user
    initialState.user = { email, username }
    const boards = await Board.findAll({
      where: {
        userId: req.user.id,
      },
      include: {
        model: List,
        include: Card,
      },
    })
    initialState.boards = boards.map(x => x.get())
  }
  req.initialState = initialState
  next()
}
