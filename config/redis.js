require('dotenv').config()
const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_DB_URI)

redis.on('error', (error) => {
  console.log('Redis client error: ', error)
})

redis.on('connect', () => {
  console.log('Connection Successful!!')
})

module.exports = redis
