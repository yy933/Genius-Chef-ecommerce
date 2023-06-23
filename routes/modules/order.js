const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/order-controller')
const paymentController = require('../../controllers/payment-controller')
const { authenticator, authenticatedUser } = require('../../middleware/auth')

router.get('/:showId/payment/:userId/paypal/success', authenticator, authenticatedUser, paymentController.checkoutWithPaypalSuccess)
router.get('/:showId/payment/:userId/paypal/cancel', authenticator, authenticatedUser, paymentController.checkoutWithPaypalCancel)

router.post('/:showId/payment/:userId/ecpay/returnResult', authenticator, authenticatedUser, paymentController.checkoutWithCreditCardReturnResult)
router.post('/:showId/payment/:userId/ecpay/result', authenticator, authenticatedUser, paymentController.checkoutWithCreditCardResult)
router.get('/:showId/payment/:userId/ecpay', authenticator, authenticatedUser, paymentController.checkoutWithCreditCard)
router.post('/:showId/payment/:userId/paypal', authenticator, authenticatedUser, paymentController.checkoutWithPaypal)
router.get('/:showId/payment/:userId', authenticator, authenticatedUser, paymentController.getOrderPayment)
router.post('/:showId/cancel/:userId', authenticator, authenticatedUser, orderController.cancelOrder)
router.post('/:userId', authenticator, authenticatedUser, orderController.sendOrder)
module.exports = router
