import models from '~/server/models'

const { Board, List, Card } = models

export const findBoardById = async boardId =>
  Board.findByPk(boardId, {
    include: [
      {
        model: List,
        include: [Card],
      },
    ],
    order: [
      [List, 'index'],
      [List, Card, 'index'],
    ],
  })
