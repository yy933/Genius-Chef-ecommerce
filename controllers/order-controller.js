const { Order, User, Delivery, Payment, Cart, sequelize } = require('../models')
const mailService = require('../helpers/email-helpers')
const orderController = {
  sendOrder: async (req, res, next) => {
    const t = await sequelize.transaction()
    try {
      const { userId } = req.params
      if (req.user.id.toString() !== userId) {
        return res.redirect('/')
      }
      let { menu, preference, servings, meals, totalAmount, recurringSub, name, phone, email, address, preferredDay, preferredTime } = req.body
      if (!req.body) {
        req.flash('warning_msg', 'All fields are required!')
        res.redirect(`/users/cart/${userId}`)
      }
      if (recurringSub === 'yes') {
        recurringSub = true
      } else {
        recurringSub = false
      }
      const showId = (new Date().getTime().toString() + userId + (Math.random() + 1).toString(36).substring(7)).slice(0, 18)

      const order = await Order.create({
        menu,
        preference: preference.toString(),
        servings,
        meals,
        totalAmount,
        status: 'Payment not confirmed',
        userId,
        showId
      }, { transaction: t })
      await Delivery.create({
        orderId: order.id,
        name,
        email,
        phone,
        address,
        preferredDay,
        preferredTime,
        status: 'Payment not confirmed'
      }, { transaction: t })
      await Payment.create({
        orderId: order.id,
        totalAmount,
        status: 'Payment not confirmed'
      }, { transaction: t })
      await Cart.destroy({
        where: { userId }
      }, { transaction: t })

      await t.commit()
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Order #${showId} at Genius Chef has been confirmed`,
        html: `<h1 style="color:#196F3D; text-align:center">Order Confirmed</h1>
            <h3>Dear ${name},</h3>
            <p style="font-size: 14px">Thank you for cooking with us! We have confirmed your order #${showId}. Your order will be active once the payment is confirmed. For order details, please check your <a href=${process.env.BASE_URL}/users/profile/${userId}>profile</a>.</p>
            <a href=${process.env.BASE_URL}/orders/${showId}/payment/${userId}><h3 style="text-align:center;">Pay Now!</h3></a>
            <br>
            <p style="font-size: 14px; color:#616A6B;">Please <a href="${process.env.BASE_URL}/contact">contact us</a> if you have any questions.</p>
            <br>
            <h3>Sincerely,<br>Genius Chef Customer Service Team</h3>`
      }
      await mailService(mailOptions)
      return res.render('order/confirmOrder', {
        orderId: order.id,
        email,
        showId,
        userId
      })
    } catch (err) {
      await t.rollback()
      req.flash('warning_msg', 'Something went wrong. Please try again.')
      next(err)
      return res.redirect('back')
    }
  },
  cancelOrder: async (req, res, next) => {
    try {
      const { userId, showId } = req.params
      const order = await Order.findOne({
        where: { showId },
        include: [
          { model: User, attributes: ['id'] }, Delivery, Payment],
        raw: true,
        nest: true
      })
      if (!order || order.User.id.toString() !== userId) {
        req.flash('warning_msg', 'Order does not exist!')
        return res.redirect(`/users/profile/${req.user.id}`)
      }
      if (order.status !== 'Payment not confirmed') {
        req.flash('warning_msg', "Order can't be cancelled!")
        return res.redirect(`/users/profile/${userId}`)
      }
      await sequelize.transaction(async (t) => {
        await Promise.all([
          Order.update({ status: 'Cancelled' }, { where: { showId }, transaction: t }),
          Delivery.update({ status: 'Cancelled' }, { where: { orderId: order.id }, transaction: t }),
          Payment.update({ status: 'Cancelled' }, { where: { orderId: order.id }, transaction: t })
        ])
      })
      req.flash('success_msg', `Order #${showId} has been cancelled!`)
      return res.redirect(`/users/profile/${userId}/plans`)
    } catch (err) { next(err) }
  }

}
module.exports = orderController
