const adminController = {
  getAdminLogin: (req, res, next) => {
    try {
      return res.render('admin/admin-login')
    } catch (err) { next(err) }
  },
  adminLogin: (req, res, next) => {
    try {
      if (req.user.role === 'user') {
        req.flash('warning_msg', 'Access denied.')
        return res.redirect('/')
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
