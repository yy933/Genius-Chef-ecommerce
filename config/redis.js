require('dotenv').config()
const Redis = require('ioredis')
let redis = new Redis()
if (process.env.NODE_ENV === 'production') {
  redis = new Redis(process.env.REDIS_DB_URL)
}

redis.on('error', (error) => {
  console.log('Redis client error: ', error)
})

redis.on('connect', () => {
  console.log('Connection Successful!!')
})

module.exports = redis
