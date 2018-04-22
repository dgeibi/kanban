export const development = {
  dialect: 'sqlite',
  storage: './db.development.sqlite',
}

export const test = {
  dialect: 'sqlite',
  storage: ':memory:',
}

export const production = process.env.DB_NAME
  ? {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOSTNAME,
      dialect: 'mysql',
    }
  : development
