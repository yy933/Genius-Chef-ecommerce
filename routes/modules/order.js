const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/order-controller')
const { authenticator, authenticatedUser } = require('../../middleware/auth')

router.get('/:showId/payment/:userId', authenticator, authenticatedUser, orderController.getOrderPayment)

module.exports = router
