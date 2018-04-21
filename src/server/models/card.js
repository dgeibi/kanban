import Sequelize from 'sequelize'

/**
 * @param {Sequelize.Sequelize} sequelize 
 */
export default function(sequelize) {
  const Card = sequelize.define('card', {
    id: {
      primaryKey: true,
      type: Sequelize.CHAR(21),
    },
    index: {
      type: Sequelize.TINYINT,
      allowNull: false,
    },
    text: Sequelize.TEXT,
    color: {
      type: Sequelize.STRING(20),
    },
    date: {
      type: Sequelize.DATEONLY,
    }
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
