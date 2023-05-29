const { User } = require('../models')
const validator = require('email-validator')
const bcrypt = require('bcryptjs')
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
  }

}

module.exports = userController
