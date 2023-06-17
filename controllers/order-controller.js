const { Order, User, Delivery } = require('../models')
const dayjs = require('dayjs')
dayjs().format()

const orderController = {
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
      if (req.user.id.toString() !== userId) {
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
        preferredTime: order.Delivery.preferredTime
      })
    } catch (err) { next(err) }
  }

}
module.exports = orderController
