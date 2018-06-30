import Sequelize from 'sequelize'
import nanoid from 'nanoid'

/**
 * @param {Sequelize.Sequelize} sequelize
 */
export default function(sequelize) {
  const User = sequelize.define(
    'user',
    {
      id: {
        primaryKey: true,
        type: Sequelize.CHAR(21),
        defaultValue() {
          return nanoid()
        },
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING(50),
        unique: true,
      },
      password: {
        allowNull: false,
        type: Sequelize.CHAR(160),
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
    },
    {
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
    }
  )
  User.associate = models => {
    models.User.hasMany(models.Board)
  }
  return User
}
