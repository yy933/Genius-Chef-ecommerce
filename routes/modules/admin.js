const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const { authenticator, authenticatedAdmin } = require('../../middleware/auth')
const { loginValidationSchema, emailValidationSchema, passwordValidationSchema} = require('../../middleware/express-validator-helper')
const { csrfProtection, formParser } = require('../../middleware/csrf-token')
router.get('/login', csrfProtection, adminController.getAdminLogin)
router.post('/login', formParser, csrfProtection, loginValidationSchema,
  passport.authenticate('admin-local', {
    failureFlash: true,
    successRedirect: '/admin/dashboard/orders',
    failureRedirect: '/admin/login'
  }), adminController.adminLogin
)
router.get('/forgetPassword', adminController.getAdminForgetPassword)
router.post('/forgetPassword', emailValidationSchema, adminController.forgetAdminPassword)
router.get('/resetPassword', adminController.getAdminResetPassword)
router.put('/resetPassword', passwordValidationSchema, adminController.resetAdminPassword)
router.get('/dashboard/orders', authenticator, authenticatedAdmin, adminController.getAdminDashboardOrders)
router.get('/dashboard/users', authenticator, authenticatedAdmin, adminController.getAdminDashboardUsers)
router.get('/dashboard', authenticator, authenticatedAdmin, adminController.getAdminDashboardMain)
router.post('/logout', authenticator, authenticatedAdmin, adminController.adminLogOut)

module.exports = router
