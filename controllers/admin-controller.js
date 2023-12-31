const { User, ResetToken, Order, Delivery, Payment, Subscriptions } = require('../models')
const { validationResult } = require('express-validator')
const mailService = require('../helpers/email-helpers')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { getUser } = require('../helpers/req-helpers')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const dayjs = require('dayjs')
dayjs().format()

const adminController = {
  getAdminLogin: (req, res, next) => {
    try {
      return res.render('admin/admin-login', { csrfToken: req.csrfToken() })
    } catch (err) { next(err) }
  },
  adminLogin: (req, res, next) => {
    try {
      if (getUser(req).role === 'user') {
        req.flash('warning_msg', 'Access denied.')
        return res.redirect('/users/login')
      }
    } catch (err) {
      next(err)
    }
  },
  adminLogOut: (req, res, next) => {
    try {
      req.logout(function (err) {
        if (err) return next(err)
        req.flash('success_msg', 'Successfully logged out.')
        return res.redirect('/admin/login')
      })
    } catch (err) { next(err) }
  },
  getAdminForgetPassword: (req, res, next) => {
    try {
      return res.render('admin/admin-forgetPassword')
    } catch (err) { next(err) }
  },
  forgetAdminPassword: async (req, res, next) => {
    try {
      const email = req.body.email
      const validationErrors = validationResult(req).formatWith(err => err.msg).array()
      const errors = validationErrors.map(errorMsg => ({ message: errorMsg }))
      if (errors.length) {
        return res.render('admin/admin-forgetPassword', {
          errors,
          email
        })
      }
      const user = await User.findOne({ where: { email, role: 'admin' } })
      if (!user) {
        req.flash('warning_msg', `Email ${email} is not valid. Please try again.`)
        return res.redirect('/admin/forgetPassword')
      }
      await ResetToken.update({ used: 1 }, { where: { userEmail: email } })
      const token = crypto.randomBytes(80).toString('base64')
      const expiration = new Date(new Date().getTime() + (60 * 10 * 1000))
      await ResetToken.create({
        userEmail: email,
        expiration,
        token,
        used: 0
      })
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your password reset instruction from Genius Chef',
        html: `<h1 style="color:#196F3D; text-align:center">Reset Password</h1>
      <h3>Dear ${user.name},</h3>
      <p style="font-size: 14px">Please click the link below to reset your password:</p>
      <a style="color:#196F3D; font-weight:bold; font-size:20px" href="${process.env.BASE_URL}/admin/resetPassword?token=${encodeURIComponent(token)}&email=${email}">Reset Password</a>
      <p style="font-size: 14px">Link will expire in 10 minutes.</p>
      <br>
      <p style="font-size: 14px; color:#616A6B;">If you didn't make this request, please ignore this email or <a href="${process.env.BASE_URL}/contact">contact us</a>.</p>
      <br>
      <h3>Sincerely,<br>Genius Chef Customer Service Team</h3>`
      }
      await mailService(mailOptions)
      req.flash('success_msg', `An email has been sent to ${email}`)
      return res.redirect('/admin/login')
    } catch (err) {
      next(err)
      return res.redirect('/admin/forgetPassword')
    }
  },
  getAdminResetPassword: async (req, res, next) => {
    try {
      const { token, email } = req.query
      await ResetToken.destroy({
        where: {
          [Op.or]: [{ used: 1 }, { expiration: { [Op.lt]: Sequelize.fn('NOW') } }]
        }
      })
      const unusedToken = await ResetToken.findOne({
        where: {
          userEmail: email,
          expiration: { [Op.gt]: Sequelize.fn('NOW') },
          token,
          used: 0
        }
      })
      if (!unusedToken) {
        req.flash('warning_msg', 'Reset password link has expired. Please make a request again.')
        return res.redirect('/admin/forgetPassword')
      }
      return res.render('admin/admin-resetPassword', {
        email,
        token
      })
    } catch (err) {
      next(err)
      return res.redirect('/admin/forgetPassword')
    }
  },
  resetAdminPassword: async (req, res, next) => {
    try {
      const { password, email, token } = req.body
      const validationErrors = validationResult(req).formatWith(err => err.msg).array()
      const errors = validationErrors.map(errorMsg => ({ message: errorMsg }))
      if (errors.length) {
        req.flash('warning_msg', 'Please try again!')
        return res.redirect('back')
      }

      const unusedToken = await ResetToken.findOne({
        where: {
          userEmail: email,
          expiration: { [Op.gt]: Sequelize.fn('NOW') },
          token,
          used: 0
        }
      })
      if (!unusedToken) {
        req.flash('warning_msg', 'Reset password link has expired. Please make a request again.')
        return res.redirect('/admin/forgetPassword')
      }
      Promise.allSettled([
        ResetToken.update({ used: 1 }, { where: { userEmail: email } }),
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(password, salt))
          .then(hash => User.update({
            password: hash
          }, {
            where: {
              email
            }
          }))])
      req.flash('success_msg', 'Password has been successfully reset!')
      return res.redirect('/admin/login')
    } catch (error) {
      next(error)
      return res.redirect('/admin/forgetPassword')
    }
  },
  getAdminDashboardMain: (req, res, next) => {
    try {
      return res.redirect('/admin/dashboard/orders')
    } catch (error) {
      next(error)
    }
  },
  getAdminDashboardOrders: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 10
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const sortBy = req.query.sortBy || 'created_at'
      const sortDir = req.query.sortDir || 'DESC'
      const status = req.query.status || ''
      const admin = await User.findOne({
        where: { email: process.env.EMAIL },
        raw: true,
        nest: true
      })
      if (!admin || getUser(req).role === 'user') {
        req.flash('warning_msg', 'User not found!')
        return res.redirect('/users/login')
      }
      const orders = await Order.findAndCountAll({
        order: [[sortBy, sortDir]],
        include: [{ model: Delivery, attributes: ['name', 'email', 'phone', 'address', 'preferredDay', 'preferredTime'] }, { model: Payment, attributes: ['status', 'paidAt', 'paymentMethod'] }, { model: User, attributes: ['email', 'name'] }],
        where: { ...status ? { status } : {} },
        limit,
        offset,
        raw: true,
        nest: true
      })
      const statusOptions = [
        { name: 'Payment not confirmed' },
        { name: 'Payment confirmed' },
        { name: 'Picking products' },
        { name: 'Ready to ship' },
        { name: 'Cancelled' }
      ]
      if (!orders) {
        return res.render('admin/dashboard-orders', {
          path: 'orders'
        })
      }
      const order = orders.rows.map(order => ({
        id: order.id,
        userId: order.userId,
        userName: order.User.name,
        userEmail: order.User.email,
        showId: order.showId,
        orderAt: dayjs(order.createdAt).format('MMM DD, YYYY HH:mm:ss'),
        status: order.status,
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
        paymentStatus: order.Payment.status,
        paidAt: dayjs(order.Payment.paidAt).format('MMM DD, YYYY HH:mm:ss'),
        paymentMethod: order.Payment.paymentMethod
      }))
      return res.render('admin/dashboard-orders', {
        path: 'orders',
        order,
        pagination: getPagination(limit, page, orders.count),
        statusOptions
      })
    } catch (err) {
      next(err)
    }
  },
  getAdminDashboardUsers: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 10
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const sortBy = req.query.sortBy || 'id'
      const sortDir = req.query.sortDir || 'ASC'
      const active = req.query.active || ''
      const recurringSub = req.query.recurringSub || ''
      const admin = await User.findOne({
        where: { email: process.env.EMAIL },
        raw: true,
        nest: true
      })
      if (!admin || getUser(req).role === 'user') {
        req.flash('warning_msg', 'User not found!')
        return res.redirect('/users/login')
      }
      const users = await User.findAndCountAll({
        where: { role: 'user' },
        attributes: { exclude: ['password'] },
        limit,
        offset,
        order: [[sortBy, sortDir]],
        include: [
          { model: Order, attributes: ['id', 'showId'] },
          {
            model: Subscriptions,
            attributes: ['recurringSub', 'active'],
            where: {
              ...active ? { active } : {},
              ...recurringSub ? { recurringSub } : {}
            }
          }
        ],
        raw: true,
        nest: true
      })
      if (!users) {
        return res.render('admin/dashboard-users', {
          path: 'users'
        })
      }
      const userlist = users.rows.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: dayjs(user.createdAt).format('MMM DD, YYYY HH:mm:ss'),
        activeSub: user.Subscription.active,
        recurringSub: user.Subscription.recurringSub
      }))

      return res.render('admin/dashboard-users', {
        path: 'users',
        userlist,
        pagination: getPagination(limit, page, users.count),
        sortBy,
        sortDir

      })
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = adminController
