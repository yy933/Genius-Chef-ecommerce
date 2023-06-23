const { Order, User, Delivery, Payment, Cart, sequelize } = require('../models')

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
      const showId = new Date().getTime().toString() + userId

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
      return res.render('order/confirmOrder', {
        orderId: order.id,
        email,
        showId,
        userId
      })
    } catch (err) {
      await t.rollback()
      next(err)
      req.flash('warning_msg', 'Something went wrong. Please try again.')
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
