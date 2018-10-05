import Sequelize from 'sequelize'
import { capitalize } from 'lodash'
import * as configSet from '~/server/config/db'

Sequelize.Promise = Promise

const env = process.env.NODE_ENV || 'development'

const config = configSet[env]

/**
 * @type {{ Sequelize: Sequelize.SequelizeStatic, sequelize: Sequelize.Sequelize, [x:string]: Sequelize.Model }}
 */
const db = {}

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config)

const r = require.context('./', false, /^\.\/(?!index).*\.js$/)

const format = capitalize

r.keys().forEach(key => {
  const x = r(key).default
  const model = x(sequelize)
  db[format(model.name)] = model
})

Object.keys(db).forEach(key => {
  if (db[key].associate) {
    db[key].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
