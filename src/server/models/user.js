import Sequelize from 'sequelize'
import normalizeEmail from 'validator/lib/normalizeEmail'
import nanoid from 'nanoid'
import hashPw from '../security/hashPw'

/**
 * @param {Sequelize.Sequelize} sequelize
 */
export default function(sequelize) {
  const User = sequelize.define('user', {
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
      type: Sequelize.CHAR(64),
      set(val) {
        this.setDataValue('password', hashPw(val))
      }
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
      set(val) {
        this.setDataValue('email', normalizeEmail(val))
      },
    },
  })
  User.associate = models => {
    models.User.hasMany(models.Board)
  }
  return User
}
