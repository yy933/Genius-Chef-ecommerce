const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const { authenticator, authenticatedAdmin } = require('../../middleware/auth')

router.get('/login', adminController.getAdminLogin)
router.post('/login',
  passport.authenticate('admin-local', {
    failureFlash: true,
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login'
  }), adminController.adminLogin
)
router.get('/forgetPassword', adminController.getAdminForgetPassword)
router.post('/forgetPassword', adminController.forgetAdminPassword)
router.get('/resetPassword', adminController.getAdminResetPassword)
router.put('/resetPassword', adminController.resetAdminPassword)
router.get('/dashboard/orders', authenticator, authenticatedAdmin, adminController.getAdminDashboardOrders)
router.get('/dashboard/users', authenticator, authenticatedAdmin, adminController.getAdminDashboardUsers)
router.get('/dashboard', authenticator, authenticatedAdmin, adminController.getAdminDashboardMain)
router.post('/logout', authenticator, authenticatedAdmin, adminController.adminLogOut)

module.exports = router
