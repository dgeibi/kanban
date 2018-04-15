import Sequelize from 'sequelize'

import * as configSet from '../config/db'

const env = process.env.NODE_ENV || 'development'

const config = configSet[env]
const db = {}

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config)

const r = require.context('./', false, /^\.\/(?!index).*\.js$/)

r.keys().forEach(key => {
  const x = r(key).default
  const model = x(sequelize, Sequelize)
  db[model.name] = model
})

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
