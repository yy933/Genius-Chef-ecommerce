const { Order, User, Delivery, Payment, Subscriptions, sequelize } = require('../models')
const mailService = require('../helpers/email-helpers')
const { getUser } = require('../helpers/req-helpers')
const dayjs = require('dayjs')
dayjs().format()
const Ecpay = require('ecpay_aio_nodejs')
const options = require('ecpay_aio_nodejs/conf/config-example')
const { showIdGenerator } = require('../helpers/ecpay-helper')
const { error } = require('console')
const paypal = require('paypal-rest-sdk')
paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_KEY
})

const paymentController = {
  getOrderPayment: async (req, res, next) => {
    try {
      const { userId, showId } = req.params
      const order = await Order.findOne({
        where: { showId },
        include: [
          { model: User, attributes: ['id'] }, Delivery],
        raw: true,
        nest: true
      })
      if (!order || order.User.id.toString() !== userId) {
        req.flash('warning_msg', 'Order does not exist!')
        return res.redirect(`/users/profile/${req.user.id}`)
      }
      if (getUser(req).id.toString() !== userId) {
        req.flash('warning_msg', 'User not found!')
        return res.redirect(`/users/profile/${req.user.id}`)
      }
      if (order.status !== 'Payment not confirmed') {
        req.flash('warning_msg', 'Order has been paid!')
        return res.redirect(`/users/profile/${userId}`)
      }
      return res.render('order/payment', {
        userId,
        showId: order.showId,
        orderAt: dayjs(order.createdAt).format('MMM D, YYYY HH:mm:ss'),
        menu: order.menu,
        preference: order.preference,
        servings: order.servings,
        meals: order.meals,
        totalAmount: order.totalAmount,
        name: order.Delivery.name,
        email: order.Delivery.email,
        phone: order.Delivery.phone,
        address: order.Delivery.address,
        preferredDay: order.Delivery.preferredDay,
        preferredTime: order.Delivery.preferredTime,
        csrfToken: req.csrfToken()
      })
    } catch (err) { next(err) }
  },
  checkoutWithCreditCard: async (req, res, next) => {
    try {
      const { showId, userId } = req.params
      const order = await Order.findOne({
        where: { showId },
        include: [{ model: User, attributes: ['id'] }, { model: Delivery, attributes: ['email'] }],
        raw: true,
        nest: true
      })
      if (!order || order.User.id.toString() !== userId) {
        req.flash('warning_msg', 'Order does not exist!')
        return res.redirect(`/users/profile/${req.user.id}`)
      }
      if (getUser(req).id.toString() !== userId) {
        req.flash('warning_msg', 'User not found!')
        return res.redirect(`/users/profile/${req.user.id}`)
      }
      if (order.status !== 'Payment not confirmed') {
        req.flash('warning_msg', 'Order has been paid!')
        return res.redirect(`/users/profile/${userId}`)
      }
      const { totalAmount, menu, servings, meals } = req.query
      const baseParam = {
        MerchantTradeNo: showIdGenerator(userId),
        MerchantTradeDate: dayjs(order.orderAt).format('YYYY/MM/DD HH:mm:ss'),
        TotalAmount: totalAmount,
        TradeDesc: 'menu: ' + menu + ', servings: ' + servings + ', meals: ' + meals,
        ItemName: 'menu: ' + menu + ', servings: ' + servings + ', meals: ' + meals,
        ReturnURL: process.env.BASE_URL + `/orders/${showId}/payment/${userId}/ecpay/returnResult`,
        OrderResultURL: process.env.BASE_URL + `/orders/${showId}/payment/${userId}/ecpay/result`,
        CustomField1: order.Delivery.email
      }
      const createPayment = new Ecpay(options)
      let parameters = {}
      const html = createPayment.payment_client.aio_check_out_credit_onetime(parameters = baseParam)
      res.render('order/ecpayPayment', {
        result: html
      })
    } catch (err) { next(err) }
  },
  checkoutWithCreditCardReturnResult: async (req, res, next) => {
    try {
      const { RtnCode, RtnMsg, SimulatePaid } = req.body
      if (RtnCode === 1 && SimulatePaid === 1) {
        res.write('1|OK').end()
      } else {
        console.log('RtnMsg: ', RtnMsg)
        res.write('0|err')
        throw error
      }
    } catch (err) { next(err) }
  },
  checkoutWithCreditCardResult: async (req, res, next) => {
    try {
      const { MerchantTradeNo, TradeNo, TradeAmt, PaymentDate, PaymentType, RtnCode, RtnMsg, CustomField1 } = req.body
      const { userId, showId } = req.params
      const mailOptions = {
        from: process.env.EMAIL,
        to: CustomField1,
        subject: `Payment for order #${showId} at Genius Chef has been confirmed`,
        html: `<h1 style="color:#196F3D; text-align:center">Payment Confirmed</h1>
            <h3>Dear customer,</h3>
            <p style="font-size: 14px">Thank you for cooking with us! We have confirmed your payment for order #${showId}. For order details, please check your <a href=${process.env.BASE_URL}/users/profile/${userId}>profile</a>.</p>
            <br>
            <p style="font-size: 14px; color:#616A6B;">Please <a href="${process.env.BASE_URL}/contact">contact us</a> if you have any questions.</p>
            <br>
            <h3>Sincerely,<br>Genius Chef Customer Service Team</h3>`
      }
      const mailOptionsFailed = {
        from: process.env.EMAIL,
        to: CustomField1,
        subject: `Payment for order #${showId} at Genius Chef failed`,
        html: `<h1 style="color:#196F3D; text-align:center">Payment Failed</h1>
            <h3>Dear customer,</h3>
            <p style="font-size: 14px">Your payment for order #${showId} failed. For order details, please check your <a href=${process.env.BASE_URL}/users/profile/${userId}>profile</a>.</p>
            <br>
            <p style="font-size: 14px; color:#616A6B;">Please <a href="${process.env.BASE_URL}/contact">contact us</a> if you have any questions.</p>
            <br>
            <h3>Sincerely,<br>Genius Chef Customer Service Team</h3>`
      }
      if (RtnCode === '1') {
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
              status: 'Payment confirmed'
            }, { where: { orderId: order.id }, transaction: t }),
            Payment.update({
              status: 'Payment confirmed',
              paymentMethod: 'Credit Card',
              paidAt: PaymentDate,
              totalAmount: TradeAmt,
              ecpayMerchantTradeNo: MerchantTradeNo,
              ecpayTradeNo: TradeNo
            }, { where: { orderId: order.id }, transaction: t }),
            Subscriptions.update({
              active: true
            }, { where: { userId }, transaction: t }),
            mailService(mailOptions)
          ])
        })
        res.render('order/confirmPayment', {
          isSuccess: true,
          userId,
          showId,
          email: CustomField1,
          PaymentType: 'Credit Card',
          PaymentDate: dayjs(PaymentDate).format('YYYY/MM/DD HH:mm:ss'),
          TradeAmt,
          status: 'Payment confirmed'
        })
      } else {
        console.log('RtnCode: ' + RtnCode + 'RtnMsg: ' + RtnMsg)
        await sequelize.transaction(async (t) => {
          const order = await Order.findOne({
            attributes: ['id'],
            where: { showId },
            transaction: t
          })
          await Promise.all([
            Payment.update({
              status: 'Payment failed.',
              paymentMethod: PaymentType,
              paidAt: PaymentDate,
              totalAmount: TradeAmt,
              ecpayMerchantTradeNo: MerchantTradeNo,
              ecpayTradeNo: TradeNo
            }, { where: { orderId: order.id }, transaction: t }),
            mailService(mailOptionsFailed)
          ])
        })
        res.render('order/confirmPayment', {
          isSuccess: false,
          userId,
          showId,
          email: CustomField1,
          PaymentType: 'Credit Card',
          PaymentDate: dayjs(PaymentDate).format('YYYY/MM/DD HH:mm:ss'),
          TradeAmt,
          status: 'Payment failed'
        })
      }
    } catch (err) { next(err) }
  },
  checkoutWithPaypal: async (req, res, next) => {
    try {
      const { showId, userId } = req.params
      const { totalAmount, email } = req.body
      const order = await Order.findOne({
        where: { showId },
        include: [{ model: User, attributes: ['id'] }, Delivery],
        raw: true,
        nest: true
      })
      if (!order || order.User.id.toString() !== userId) {
        req.flash('warning_msg', 'Order does not exist!')
        return res.redirect(`/users/profile/${req.user.id}`)
      }
      if (getUser(req).id.toString() !== userId) {
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
            currency: 'TWD',
            total: totalAmount
          },
          description: 'Payment for a new plan at Genius Chef'
        }],
        redirect_urls: {
          return_url: process.env.BASE_URL + `/orders/${showId}/payment/${userId}/paypal/success`,
          cancel_url: process.env.BASE_URL + `/orders/${showId}/payment/${userId}/paypal/cancel`
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
    } catch (err) { next(err) }
  },
  checkoutWithPaypalSuccess: (req, res, next) => {
    try {
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
            console.log('Error: ', error.response)
            next(error)
            res.redirect(`users/profile/${userId}`)
          } else {
            const shippingInfo = payment.payer.payer_info.shipping_address
            const mailOptions = {
              from: process.env.EMAIL,
              to: payment.transactions[0].custom,
              subject: `Payment for order #${showId} at Genius Chef has been confirmed`,
              html: `<h1 style="color:#196F3D; text-align:center">Payment Confirmed</h1>
            <h3>Dear customer,</h3>
            <p style="font-size: 14px">Thank you for cooking with us! We have confirmed your payment for order #${showId}. For order details, please check your <a href=${process.env.BASE_URL}/users/profile/${userId}>profile</a>.</p>
            <br>
            <p style="font-size: 14px; color:#616A6B;">Please <a href="${process.env.BASE_URL}/contact">contact us</a> if you have any questions.</p>
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
                  paidAt: payment.update_time,
                  totalAmount: payment.transactions[0].amount.total,
                  paypalPaymentId: payment.id
                }, { where: { orderId: order.id }, transaction: t }),
                Subscriptions.update({
                  active: true
                }, { where: { userId }, transaction: t }),
                mailService(mailOptions)
              ])
            })
            return res.render('order/confirmPayment', {
              isSuccess: true,
              userId,
              showId,
              email: payment.transactions[0].custom,
              PaymentType: 'Paypal',
              PaymentDate: dayjs(payment.update_time).format('YYYY/MM/DD HH:mm:ss'),
              TradeAmt: payment.transactions[0].amount.total,
              status: 'Payment confirmed'
            })
          }
        }
      )
    } catch (err) { next(err) }
  },
  checkoutWithPaypalCancel: async (req, res, next) => {
    try {
      const { showId, userId } = req.params
      const order = await Order.findOne({
        attributes: ['id', 'totalAmount'],
        where: { showId }
      })

      return res.render('order/confirmPayment', {
        isSuccess: false,
        userId,
        showId,
        PaymentType: 'Paypal',
        PaymentDate: dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss'),
        TradeAmt: order.totalAmount,
        status: 'Payment failed'
      })
    } catch (err) { next(err) }
  }
}

module.exports = paymentController
