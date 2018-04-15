import Sequelize from 'sequelize' // eslint-disable-line

/**
 * @param {Sequelize.Sequelize} sequelize
 */
export default function(sequelize) {
  const List = sequelize.define('List', {
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    index: Sequelize.TINYINT,
  })
  List.associate = models => {
    models.List.hasMany(models.Card)
    models.List.belongsTo(models.Board, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    })
  }
  return List
}
