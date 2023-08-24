require('dotenv').config()
const Redis = require('ioredis')
// development
const redis = new Redis() // connect to 127.0.0.1:6379

// production
// const redis = new Redis(process.env.REDIS_DB_URI)

redis.on('error', (error) => {
  console.log('Redis client error: ', error)
})

redis.on('connect', () => {
  console.log('Connection Successful!!')
})

module.exports = redis
