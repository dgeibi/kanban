import Sequelize from 'sequelize'

/**
 * @param {Sequelize.Sequelize} sequelize
 */
export default function(sequelize) {
  const List = sequelize.define('List', {
    id: {
      primaryKey: true,
      type: Sequelize.CHAR(21),
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    index: {
      type: Sequelize.TINYINT,
      allowNull: false,
    },
  })
  List.associate = models => {
    List.Card = models.List.hasMany(models.Card)
    List.Board = models.List.belongsTo(models.Board, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    })
  }
  return List
}
