import Sequelize from 'sequelize' // eslint-disable-line

/**
 * @param {Sequelize.Sequelize} sequelize 
 */
export default function(sequelize) {
  const Card = sequelize.define('Card', {
    index: Sequelize.TINYINT,
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
