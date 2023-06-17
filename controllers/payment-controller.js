const { Order, User, Delivery, Payment, Subscriptions, sequelize } = require('../models')
const paypal = require('paypal-rest-sdk')
const mailService = require('../helpers/email-helpers')

paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_KEY
})

const paymentController = {
  checkoutWithPaypal: async (req, res, next) => {
    try {
      const { showId, userId } = req.params
      const { totalAmount, email } = req.body
      const order = await Order.findOne({
        where: { showId },
        include: [{ model: User, attributes: ['id', 'email'] }, Delivery],
        raw: true,
        nest: true
      })
      if (!order || order.User.id.toString() !== userId) {
        req.flash('warning_msg', 'Order does not exist!')
        return res.redirect(`/users/profile/${req.user.id}`)
      }
      if (req.user.id.toString() !== userId) {
        req.flash('warning_msg', 'User not found!')
        return res.redirect(`/users/profile/${req.user.id}`)
      }
      if (order.status !== 'Payment not confirmed') {
        req.flash('warning_msg', 'Order has been paid!')
        return res.redirect(`/users/profile/${userId}`)
      }
      const createPaymentJson = {
        intent: 'sale',
        payer: {
          payment_method: 'paypal'
        },
        transactions: [{
          custom: email,
          amount: {
            currency: 'USD',
            total: totalAmount
          },
          description: 'Payment for a new plan at Genius Chef'
        }],
        redirect_urls: {
          return_url: process.env.CLIENT_URL + `/orders/${showId}/payment/${userId}/paypal/success`,
          cancel_url: process.env.CLIENT_URL + `/orders/${showId}/payment/${userId}/paypal/cancel`
        },
        note_to_payer: 'Contact us for any questions on your order.'

      }
      paypal.payment.create(createPaymentJson, (error, payment) => {
        if (error) {
          throw error
        } else {
          payment.links.forEach(link => {
            if (link.rel === 'approval_url') {
              res.redirect(link.href)
            }
          })
        }
      })
      console.log(req.body)
    } catch (err) { next(err) }
  },
  checkoutWithPaypalSuccess: (req, res, next) => {
    const { paymentId, PayerID } = req.query
    const { showId, userId } = req.params
    const executePaymentJson = {
      payer_id: PayerID
    }

    paypal.payment.execute(
      paymentId,
      executePaymentJson,
      async function (error, payment) {
        if (error) {
          console.log(error.response)
          next(error)
          res.redirect(`users/profile/${userId}`)
        } else {
          console.log(payment)
          const shippingInfo = payment.payer.payer_info.shipping_address
          const mailOptions = {
            from: process.env.EMAIL,
            to: payment.transactions[0].custom,
            subject: `Payment for order #${showId} at Genius Chef has been confirmed`,
            html: `<h1 style="color:#196F3D; text-align:center">Payment Confirmed</h1>
            <h3>Dear customer,</h3>
            <p style="font-size: 14px">Thank you for cooking with us! We have confirmed your payment for order #${showId}. For order details, please check your <a href=${process.env.CLIENT_URL}/users/profile/${userId}>profile</a>.</p>
            <br>
            <p style="font-size: 14px; color:#616A6B;">Please <a href="${process.env.CLIENT_URL}/contact">contact us</a> if you have any questions.</p>
            <br>
            <h3>Sincerely,<br>Genius Chef Customer Service Team</h3>`
          }
          await sequelize.transaction(async (t) => {
            const order = await Order.findOne({
              attributes: ['id'],
              where: { showId },
              transaction: t
            })
            await Promise.all([
              order.update({
                status: 'Payment confirmed'
              }, { where: { showId }, transaction: t }),
              Delivery.update({
                status: 'Payment confirmed',
                name: shippingInfo.recipient_name,
                address: shippingInfo.line1 + ' ' + (shippingInfo.line2 ? shippingInfo.line2 : '') + ', ' + shippingInfo.city + ' ' + (shippingInfo.state ? shippingInfo.state : '') + ' ' + shippingInfo.postal_code + shippingInfo.country_code
              }, { where: { orderId: order.id }, transaction: t }),
              Payment.update({
                status: 'Payment confirmed',
                paymentMethod: 'Paypal',
                paidAt: new Date(),
                totalAmount: order.totalAmount,
                paypalPaymentId: payment.id
              }, { where: { orderId: order.id }, transaction: t }),
              Subscriptions.update({
                active: true
              }, { where: { userId }, transaction: t }),
              mailService(mailOptions)
            ])
          })

          res.render('order/confirmPayment', {
            userId,
            showId,
            email: payment.transactions[0].custom
          })
        }
      }
    )
  },
  checkoutWithPaypalCancel: (req, res, next) => {
    res.send('Payment failed.')
  }
}

module.exports = paymentController
