const helpers = require('../req_helpers')

const authenticator = (req, res, next) => {
  if (helpers.authenticator(req)) {
    return next()
  }
  req.flash('warning_msg', 'Please log in to proceed.')
  return res.redirect('/login')
}

const authenticatedUser = (req, res, next) => {
  if (helpers.authenticator(req)) {
    if (req.user.role === 'user') {
      return next()
    }
    req.flash('warning_msg', 'Access denied.')
    return res.redirect('/')
  }
  req.flash('warning_msg', 'Please log in to proceed.')
  return res.redirect('/login')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.authenticator(req)) {
    if (req.user.role === 'admin') {
      return next()
    }
    req.flash('warning_msg', 'Access denied.')
    return res.redirect('/contact')
  }
  req.flash('warning_msg', 'Please log in to proceed.')
  return res.redirect('/login')
}
module.exports = { authenticator, authenticatedUser, authenticatedAdmin }
