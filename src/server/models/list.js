import Sequelize from 'sequelize'

/**
 * @param {Sequelize.Sequelize} sequelize
 */
export default function(sequelize) {
  const List = sequelize.define('list', {
    id: {
      primaryKey: true,
      type: Sequelize.CHAR(21),
    },
    title: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    index: {
      type: Sequelize.TINYINT,
      allowNull: false,
    },
  })
  List.associate = models => {
    models.List.hasMany(models.Card, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    })
    models.List.belongsTo(models.Board)
  }
  return List
}
