import Sequelize from 'sequelize'

/**
 * @param {Sequelize.Sequelize} sequelize
 */
export default function(sequelize) {
  const Board = sequelize.define('Board', {
    title: {
      type: Sequelize.STRING(255),
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
  return Board
}
