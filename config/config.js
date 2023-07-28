
const { DB_PASSWORD, REMOTE_DB_URL } = process.env
module.exports = {
  development: {
    username: 'postgres',
    password: DB_PASSWORD,
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
    use_env_variable: REMOTE_DB_URL
  }
}
