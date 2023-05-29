const { User, ResetToken } = require('../models')
const validator = require('email-validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const mailService = require('../helpers/email-helpers')
const priceRule = require('../helpers/price-calculation')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const userController = {
  getSignIn: (req, res, next) => {
    try {
      return res.render('login')
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
    req.logout(function (err) {
      if (err) return next(err)
      req.flash('success_msg', 'Successfully logged out.')
      return res.redirect('/')
    })
  // if (req.cookies.jwt) {
  //   res.clearCookie('jwt', { path: '/' }).status(200).redirect('/login')
  // } else {
  //   res.status(401).json({ message: 'Invalid token.' })
  // }
  },
  getSignUp: (req, res, next) => {
    try {
      return res.render('signup')
    } catch (err) { next(err) }
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, confirmPassword } = req.body
      const errors = []
      const regex = /^(?=.*\d)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}$/
      if (!name || !email || !password || !confirmPassword) {
        errors.push({ message: 'All fields are required.' })
      }
      if (!validator.validate(email)) {
        errors.push({ message: 'Please provide a valid email.' })
      }
      if (password !== confirmPassword) {
        errors.push({ message: 'Make sure password and confirm password match.' })
      }
      if (!regex.test(password)) {
        errors.push({ message: 'The password must contain at least 8 and maximum 16 characters, including at least 1 uppercase, 1 lowercase, and one number.' })
      }
      if (errors.length) {
        console.log(errors)
        return res.render('signup', {
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
        return res.render('signup', {
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
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
      req.flash('success_msg', 'Successfully created an account!')
      return res.redirect('/users/login')
    } catch (error) {
      console.log(error)
      req.flash('warning_msg', 'Something went wrong, please try again!')
      return res.render('signup')
    }
  },
  getForgetPassword: (req, res, next) => {
    try {
      return res.render('forget-password')
    } catch (err) { next(err) }
  },
  forgetPassword: async (req, res, next) => {
    try {
      const email = req.body.email
      const user = await User.findOne({ where: { email } })
      if (!user) {
        req.flash('warning_msg', `Email ${email} is not valid. Please try again.`)
        return res.redirect('/forgetPassword')
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
      <a style="color:#196F3D; font-weight:bold; font-size:20px" href="${process.env.CLIENT_URL}/resetPassword?token=${encodeURIComponent(token)}&email=${email}">Reset Password</a>
      <p style="font-size: 14px">Link will expire in 10 minutes.</p>
      <br>
      <p style="font-size: 14px; color:#616A6B;">If you didn't make this request, please ignore this email or <a href="${process.env.CLIENT_URL}/contact">contact us</a>.</p>
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
        req.flash('warning_msg', 'Reset password link has expired. Please make a request again.')
        return res.redirect('/users/forgetPassword')
      }
      return res.render('reset-password', {
        email,
        token
      })
    } catch (error) {
      next(error)
      res.redirect('/users/forgetPassword')
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      const { password, confirmPassword, email, token } = req.body
      const regex = /^(?=.*\d)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}$/
      if (!regex.test(password)) {
        req.flash('warning_msg', 'The password must contain at least 8 and maximum 16 characters, including at least 1 uppercase, 1 lowercase, and one number.')
        return res.redirect('back')
      }
      if (password !== confirmPassword) {
        req.flash('warning_msg', 'Make sure password and confirm password match.')
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
  getProfile: (req, res, next) => {
    try {
      return res.render('user/profile')
    } catch (err) { next(err) }
  },
  getPlans: (req, res, next) => {
    try {
      return res.render('plans')
    } catch (err) { next(err) }
  },
  getCart: (req, res, next) => {
    try {
      return res.render('user/cart')
    } catch (err) { next(err) }
  },
  sendPlansToCart: (req, res, next) => {
    try {
      let { menu, preference, servings, meals, mealTotal } = req.body
      console.log(req.body)
      if (!mealTotal) {
        mealTotal = priceRule(servings, meals)
      }
      res.render('user/cart', {
        menu,
        preference,
        servings,
        meals,
        mealTotal
      })
    } catch (err) {
      next(err)
      req.flash('warning_msg', 'Plans could not be added to cart, please try again!')
      return res.redirect('/plans')
    }
  },
  sendOrder: (req, res, next) => {
    try {
      res.render('confirm')
    } catch (err) { next(err) }
  }

}

module.exports = userController
