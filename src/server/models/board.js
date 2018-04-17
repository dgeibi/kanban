import Sequelize from 'sequelize'

/**
 * @param {Sequelize.Sequelize} sequelize
 */
export default function(sequelize) {
  const Board = sequelize.define('Board', {
    id: {
      primaryKey: true,
      type: Sequelize.CHAR(21),
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    color: {
      type: Sequelize.STRING(20),
    },
  })
  Board.associate = models => {
    Board.List = models.Board.hasMany(models.List)
    Board.User = models.Board.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    })
  }
  return Board
}
