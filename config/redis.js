require('dotenv').config()
const Redis = require('ioredis')
let redis = new Redis() // Connect to 127.0.0.1:6379
if (process.env.NODE_ENV === 'production') {
  redis = new Redis(process.env.REDIS_DB_URI)
}

redis.on('error', (error) => {
  console.log('Redis client error: ', error)
})

redis.on('connect', () => {
  console.log('Connection Successful!!')
})

module.exports = redis
