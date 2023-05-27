const jwt = require('jsonwebtoken')
const { User } = require('../models')

const authenticatedUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    const user = await User.findByPk(decoded.id)
    const { exp, role } = decoded
    if (Date.now() / 1000 > exp) {
      req.flash('warning_msg', 'Token has expired. Please try again.')
      return res.redirect('/login')
    }
    if (!user || role !== 'user') {
      req.flash('warning_msg', 'User not found.')
      return res.redirect('/login')
    }
    req.token = token
    req.user = user
    res.locals.isAuthenticated = true
    next()
  } catch (error) {
    req.flash('warning_msg', 'Please login to proceed. ')
    return res.status(401).redirect('/login')
  }
}

const authenticatedAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    const user = await User.findByPk(decoded.id)
    const { exp, role } = decoded
    if (!user || role !== 'admin') {
      req.flash('warning_msg', 'User not found.')
      return res.redirect('/admin/login')
    }
    if (Date.now() / 1000 > exp) {
      req.flash('warning_msg', 'Please try again.')
      return res.redirect('/admin/login')
    }
    req.token = token
    req.user = user
    next()
  } catch (error) {
    req.flash('warning_msg', 'Please login to proceed. ')
    return res.status(401).redirect('/admin/login')
  }
}

module.exports = { authenticatedUser, authenticatedAdmin }
