const express = require('express')
const router = express.Router()

const { authenticator, authenticatedUser, authenticatedAdmin } = require('../middleware/auth')
const user = require('./modules/user')
const admin = require('./modules/admin')
const auth = require('./modules/auth')

router.use('/users', user)
router.use('/auth', auth)
// router.use('/admin', admin)

module.exports = router