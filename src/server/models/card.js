import Sequelize from 'sequelize'

/**
 * @param {Sequelize.Sequelize} sequelize 
 */
export default function(sequelize) {
  const Card = sequelize.define('Card', {
    id: {
      primaryKey: true,
      type: Sequelize.CHAR(21),
    },
    index: {
      type: Sequelize.TINYINT,
      allowNull: false,
    },
    text: Sequelize.TEXT,
  })
  Card.associate = models => {
    models.Card.belongsTo(models.List, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    })
  }
  return Card
}
