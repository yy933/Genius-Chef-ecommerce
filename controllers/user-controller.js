const { User, ResetToken, Cart, Order, Delivery, Subscriptions, Payment, sequelize } = require('../models')
const validator = require('email-validator')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const mailService = require('../helpers/email-helpers')
const priceRule = require('../helpers/price-calculation')
const reqHelper = require('../req_helpers')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const dayjs = require('dayjs')
dayjs().format()

const userController = {
  getSignIn: (req, res, next) => {
    try {
      return res.render('user/login')
    } catch (err) { next(err) }
  },
  signIn: (req, res, next) => {
    try {
      if (req.user.role === 'admin') {
        req.flash('warning_msg', 'Access denied.')
        return res.redirect('/')
      }
    } catch (err) {
      next(err)
    }
  // async (req, res, next) => {
  //   try {
  //     const userData = req.user.toJSON()
  //     delete userData.password
  //     const token = jwt.sign(userData, process.env.JWT_KEY, { expiresIn: '10d' })
  //     return res.status(200).cookie('jwt', token, {
  //       path: '/',
  //       httpOnly: true,
  //       secure: false, // set to true on production
  //       sameSite: 'Lax',
  //       maxAge: 2592000000
  //     }).redirect('/')
  //   } catch (error) {
  //     console.log('Error:', error)
  //     req.flash('warning_msg', 'Error')
  //     res.redirect('/login')
  //   }
  // }
  },
  logOut: (req, res, next) => {
    try {
      req.logout(function (err) {
        if (err) return next(err)
        req.flash('success_msg', 'Successfully logged out.')
        return res.redirect('/users/login')
      })
    } catch (err) { next(err) }

  // if (req.cookies.jwt) {
  //   res.clearCookie('jwt', { path: '/' }).status(200).redirect('/login')
  // } else {
  //   res.status(401).json({ message: 'Invalid token.' })
  // }
  },
  getSignUp: (req, res, next) => {
    try {
      return res.render('user/signup')
    } catch (err) { next(err) }
  },
  signUp: async (req, res, next) => {
    try {
      const validationErrors = validationResult(req).formatWith(err => err.msg).array()
      const errors = validationErrors.map(errorMsg => ({ message: errorMsg }))
      const { name, email, password, confirmPassword } = req.body
      if (errors.length) {
        return res.render('user/signup', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      }

      const user = await User.findOne({ where: { email } })
      if (user) {
        errors.push({ message: 'This email has already been registered.' })
        return res.render('user/signup', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      }

      bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(async (hash) => {
          const t = await sequelize.transaction()
          try {
            const user = await User.create({
              name,
              email,
              password: hash
            }, { transaction: t })
            await Subscriptions.create({
              userId: user.id,
              active: false
            }, { transaction: t })
            await t.commit()
          } catch (error) { await t.rollback() }
        }
        )
      req.flash('success_msg', 'Successfully created an account!')
      return res.redirect('/users/login')
    } catch (error) {
      next(error)
      req.flash('warning_msg', 'Something went wrong, please try again!')
      return res.render('user/signup')
    }
  },
  getForgetPassword: (req, res, next) => {
    try {
      return res.render('user/forget-password')
    } catch (err) { next(err) }
  },
  forgetPassword: async (req, res, next) => {
    try {
      const email = req.body.email
      const validationErrors = validationResult(req).formatWith(err => err.msg).array()
      const errors = validationErrors.map(errorMsg => ({ message: errorMsg }))
      if (errors.length) {
        return res.render('user/forget-password', {
          errors,
          email
        })
      }
      const user = await User.findOne({ where: { email, role: 'user' } })
      if (!user) {
        req.flash('warning_msg', `Email ${email} is not valid. Please try again.`)
        return res.redirect('/users/forgetPassword')
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
      <a style="color:#196F3D; font-weight:bold; font-size:20px" href="${process.env.BASE_URL}/users/resetPassword?token=${encodeURIComponent(token)}&email=${email}">Reset Password</a>
      <p style="font-size: 14px">Link will expire in 10 minutes.</p>
      <br>
      <p style="font-size: 14px; color:#616A6B;">If you didn't make this request, please ignore this email or <a href="${process.env.BASE_URL}/contact">contact us</a>.</p>
      <br>
      <h3>Sincerely,<br>Genius Chef Customer Service Team</h3>`
      }
      await mailService(mailOptions)
      req.flash('success_msg', `An email has been sent to ${email}`)
      return res.redirect('/users/login')
    } catch (err) {
      next(err)
      return res.redirect('/users/forgetPassword')
    }
  },
  getResetPassword: async (req, res, next) => {
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
        req.flash('warning_msg', 'Reset password link has expired. Please make another request.')
        return res.redirect('/users/forgetPassword')
      }
      return res.render('user/reset-password', {
        email,
        token
      })
    } catch (error) {
      next(error)
      return res.redirect('/users/forgetPassword')
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      const { password, email, token } = req.body
      const validationErrors = validationResult(req).formatWith(err => err.msg).array()
      const errors = validationErrors.map(errorMsg => ({ message: errorMsg }))
      if (errors.length) {
        req.flash('warning_msg', 'Please try again.')
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
        req.flash('warning_msg', 'Reset password link has expired. Please make another request.')
        return res.redirect('/users/forgetPassword')
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
      return res.redirect('/users/login')
    } catch (error) {
      next(error)
      return res.redirect('/users/forgetPassword')
    }
  },
  getProfileMain: (req, res, next) => {
    try {
      const { userId } = req.params
      return res.redirect(`/users/profile/${userId}/plans`)
    } catch (error) { next(error) }
  },
  getProfile: async (req, res, next) => {
    try {
      const { userId, section } = req.params
      const user = await User.findByPk(userId, {
        attributes: ['name', 'email', 'id'],
        include: { model: Subscriptions, attributes: ['active', 'recurringSub'] },
        raw: true,
        nest: true
      })
      if (!user || user.role === 'admin') {
        req.flash('warning_msg', 'User not found!')
        return res.redirect('/')
      }
      if (req.user.id.toString() !== userId) {
        req.flash('warning_msg', 'Access denied.')
        return res.redirect(`/users/profile/${req.user.id}`)
      }
      if (section === 'plans') {
        const orders = await Order.findAll({
          where: { userId },
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [{ model: Delivery, attributes: ['name', 'email', 'phone', 'address', 'preferredDay', 'preferredTime'] }, { model: Payment, attributes: ['status', 'paidAt', 'paymentMethod'] }],
          raw: true,
          nest: true
        })
        if (!orders) {
          return res.render('user/profile', {
            isEmpty: true,
            path: 'plans',
            userId: user.id
          })
        }
        const order = orders.map(order => ({
          userId,
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
        return res.render('user/profile', {
          isEmpty: false,
          path: `${section}`,
          userId: user.id,
          order
        })
      }
      if (section === 'manageSettings') {
        return res.render('user/editProfile', {
          path: 'settings',
          userId: user.id,
          name: user.name,
          email: user.email,
          recurringSub: user.Subscription.recurringSub
        })
      }
      if (section === 'changePassword') {
        return res.render('user/editPassword', {
          path: 'settings',
          userId,
          email: user.email
        })
      }

      return res.render('user/profile', {
        path: `${section}`,
        userId: user.id,
        name: user.name,
        email: user.email,
        recurringSub: user.Subscription.recurringSub
      })
    } catch (err) {
      return next(err)
    }
  },
  manageSettings: async (req, res, next) => {
    try {
      let { name, email, recurringSub } = req.body
      const { userId } = req.params
      if (req.user.id.toString() !== userId) {
        req.flash('warning_msg', 'Access denied.')
        return res.redirect('back')
      }
      const validationErrors = validationResult(req).formatWith(err => err.msg).array()
      const errors = validationErrors.map(errorMsg => ({ message: errorMsg }))
      const [user, checkedExistedUser] = await Promise.all([
        User.findByPk(userId,
          {
            attributes: ['id', 'name', 'email'],
            include: { model: Subscriptions, attributes: ['recurringSub'] }
          }),
        User.findOne({ where: { email } })
      ])
      if (!user) {
        errors.push({ message: 'User not found!' })
        return res.render('user/signup', {
          errors
        })
      }

      if (checkedExistedUser && checkedExistedUser.id !== req.user.id) {
        errors.push({ message: 'This email has already been registered!' })
      }
      if (errors.length) {
        return res.render('user/editProfile', {
          errors,
          userId,
          path: 'settings',
          name,
          email,
          recurringSub
        })
      }

      if (recurringSub === 'Yes') {
        recurringSub = true
      } else {
        recurringSub = false
      }
      await Promise.all([
        user.update({
          name,
          email
        }),
        Subscriptions.update({
          recurringSub
        }, { where: { userId } })])

      return res.redirect(`/users/profile/${userId}/settings`)
    } catch (err) { next(err) }
  },
  changePassword: async (req, res, next) => {
    try {
      const { userId } = req.params
      const { password, confirmPassword } = req.body
      if (reqHelper.getUser(req).id.toString() !== userId) {
        req.flash('warning_msg', 'Access denied.')
        return res.redirect('back')
      }
      const validationErrors = validationResult(req).formatWith(err => err.msg).array()
      const errors = validationErrors.map(errorMsg => ({ message: errorMsg }))
      if (errors.length) {
        return res.render('user/editPassword', {
          password,
          confirmPassword,
          errors,
          userId
        })
      }

      await bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.update({
          password: hash
        }, {
          where: {
            id: userId
          }
        }))

      req.flash('success_msg', 'Password has been successfully changed!')
      return res.redirect(`/users/profile/${userId}/settings`)
    } catch (err) {
      next(err)
    }
  },
  getCart: async (req, res, next) => {
    try {
      const { userId } = req.params
      if (req.user.id.toString() !== userId) {
        return res.redirect('/')
      }
      const cart = await Cart.findByPk(userId, {
        include: { model: User, attributes: ['name', 'email'] }
      })
      if (!cart) {
        return res.render('user/cart', {
          isEmpty: true
        })
      }
      const cartData = {
        isEmpty: false,
        menu: cart.menu,
        preference: cart.preference,
        servings: cart.servings,
        meals: cart.meals,
        totalAmount: cart.totalAmount,
        email: cart.User.email,
        name: cart.User.name
      }
      return res.render('user/cart', cartData)
    } catch (err) { next(err) }
  },
  sendPlansToCart: async (req, res, next) => {
    try {
      const { userId } = req.params
      if (req.user.id.toString() !== userId) {
        return res.redirect('/')
      }
      let { menu, preference, servings, meals, totalAmount } = req.body
      if (!totalAmount) {
        totalAmount = priceRule(servings, meals)
      }
      const oldCart = await Cart.findByPk(userId)
      if (oldCart) {
        await oldCart.update({
          menu,
          preference: preference?.toString() || 'No special preference',
          servings,
          meals,
          totalAmount
        })
      } else {
        await Cart.create({
          userId,
          menu,
          preference: preference?.toString() || 'No special preference',
          servings,
          meals,
          totalAmount
        })
      }
      return res.render('user/cart', {
        isEmpty: false,
        menu,
        preference,
        servings,
        meals,
        totalAmount
      })
    } catch (err) {
      next(err)
      req.flash('warning_msg', 'Plans could not be added to cart, please try again!')
      return res.redirect('/plans')
    }
  }

}

module.exports = userController
