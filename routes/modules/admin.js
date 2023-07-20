const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const { authenticator, authenticatedAdmin } = require('../../middleware/auth')
const { csrfProtection, formParser } = require('../../middleware/csrf-token')
router.get('/login', csrfProtection, adminController.getAdminLogin)
router.post('/login', formParser, csrfProtection,
  passport.authenticate('admin-local', {
    failureFlash: true,
    successRedirect: '/admin/dashboard/orders',
    failureRedirect: '/admin/login'
  }), adminController.adminLogin
)
router.get('/forgetPassword', csrfProtection, adminController.getAdminForgetPassword)
router.post('/forgetPassword', formParser, csrfProtection, adminController.forgetAdminPassword)
router.get('/resetPassword', csrfProtection, adminController.getAdminResetPassword)
router.put('/resetPassword', formParser, csrfProtection, adminController.resetAdminPassword)
router.get('/dashboard/orders', authenticator, authenticatedAdmin, adminController.getAdminDashboardOrders)
router.get('/dashboard/users', authenticator, authenticatedAdmin, adminController.getAdminDashboardUsers)
router.get('/dashboard', authenticator, authenticatedAdmin, adminController.getAdminDashboardMain)
router.post('/logout', authenticator, authenticatedAdmin, adminController.adminLogOut)

module.exports = router
