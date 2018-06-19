import Sequelize from 'sequelize'
import normalizeEmail from 'validator/lib/normalizeEmail'
import nanoid from 'nanoid'
import { bhash } from '~/server/helper'

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
        type: Sequelize.CHAR(60),
        set(val) {
          this.setDataValue('password', bhash(val))
        },
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        set(val) {
          this.setDataValue('email', normalizeEmail(val))
        },
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
