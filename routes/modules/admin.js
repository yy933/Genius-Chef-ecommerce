const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const { authenticator, authenticatedAdmin } = require('../../middleware/auth')
const { loginValidationSchema, emailValidationSchema, passwordValidationSchema } = require('../../middleware/express-validator-helper')
const { doubleCsrfProtection } = require('../../middleware/csrf-token')

// admin log in
router.get('/login', doubleCsrfProtection, adminController.getAdminLogin)
router.post('/login', doubleCsrfProtection, loginValidationSchema,
  passport.authenticate('admin-local', {
    failureFlash: true,
    successRedirect: '/admin/dashboard/orders',
    failureRedirect: '/admin/login'
  }), adminController.adminLogin
)

// admin log out
router.post('/logout', authenticator, authenticatedAdmin, adminController.adminLogOut)

// admin forget and reset password
router.get('/forgetPassword', adminController.getAdminForgetPassword)
router.post('/forgetPassword', emailValidationSchema, adminController.forgetAdminPassword)
router.get('/resetPassword', adminController.getAdminResetPassword)
router.put('/resetPassword', passwordValidationSchema, adminController.resetAdminPassword)

// get admin dashboard
router.get('/dashboard/orders', authenticator, authenticatedAdmin, adminController.getAdminDashboardOrders)
router.get('/dashboard/users', authenticator, authenticatedAdmin, adminController.getAdminDashboardUsers)
router.get('/dashboard', authenticator, authenticatedAdmin, adminController.getAdminDashboardMain)

module.exports = router
