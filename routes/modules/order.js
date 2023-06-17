const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/order-controller')
const paymentController = require('../../controllers/payment-controller')
const { authenticator, authenticatedUser } = require('../../middleware/auth')

router.get('/:showId/payment/:userId/paypal/success', authenticator, authenticatedUser, paymentController.checkoutWithPaypalSuccess)
router.get('/:showId/payment/:userId/paypal/cancel', authenticator, authenticatedUser, paymentController.checkoutWithPaypalCancel)
router.post('/:showId/payment/:userId/paypal', authenticator, authenticatedUser, paymentController.checkoutWithPaypal)
router.get('/:showId/payment/:userId', authenticator, authenticatedUser, orderController.getOrderPayment)
router.post('/:showId/cancel/:userId', authenticator, authenticatedUser, orderController.cancelOrder)

module.exports = router
