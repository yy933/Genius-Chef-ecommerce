const express = require('express')
const router = express.Router()

const { authenticator, authenticatedUser, authenticatedAdmin } = require('../middleware/auth')
const user = require('./modules/user')
const admin = require('./modules/admin')

router.use('/users', user)
// router.use('/admin', admin)

module.exports = router