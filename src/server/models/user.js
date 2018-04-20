import Sequelize from 'sequelize'

/**
 * @param {Sequelize.Sequelize} sequelize
 */
export default function(sequelize) {
  const User = sequelize.define('user', {
    id: {
      primaryKey: true,
      type: Sequelize.CHAR(21),
    },
    username: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    password: {
      allowNull: false,
      type: Sequelize.CHAR(64),
    },
    email: {
      type: Sequelize.STRING(50),
      unique: true,
    },
  })
  User.associate = models => {
    models.User.hasMany(models.Board)
  }
  return User
}
