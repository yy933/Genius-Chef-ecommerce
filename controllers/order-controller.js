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
          { model: User, attributes: ['id', 'name', 'email'] }],
        raw: true,
        nest: true
      })
      if (!order) {
        req.flash('warning_msg', 'Order does not exist!')
        return res.redirect('back')
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
        showId: order.showId,
        totalAmount: order.totalAmount,
        orderAt: dayjs(order.createdAt).format('MMM D, YYYY HH:mm:ss')
      })
    } catch (err) { next(err) }
  }

}
module.exports = orderController
