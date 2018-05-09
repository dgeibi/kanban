import Sequelize from 'sequelize'

/**
 * @param {Sequelize.Sequelize} sequelize
 */
export default function(sequelize) {
  const Board = sequelize.define('board', {
    id: {
      primaryKey: true,
      type: Sequelize.CHAR(21),
    },
    title: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    color: {
      type: Sequelize.STRING(20),
    },
  })
  Board.associate = models => {
    models.Board.hasMany(models.List)
    models.Board.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    })
  }
  Board.findAndCheck = (id, user) =>
    Board.findById(id, {
      attributes: ['id'],
    })
      .then(board => user.hasBoard(board))
      .catch(() => false)
  return Board
}
