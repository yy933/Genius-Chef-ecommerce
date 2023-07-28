module.exports = {
  development: {
    username: 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'genius_chef_dev',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    username: process.env.REMOTE_DB_USERNAME,
    password: process.env.REMOTE_DB_PASSWORD,
    database: process.env.REMOTE_DB,
    host: process.env.REMOTE_DB_HOST,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
}
