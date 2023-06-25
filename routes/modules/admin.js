const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const { authenticator, authenticatedAdmin } = require('../../middleware/auth')

router.get('/login', adminController.getAdminLogin)
router.post('/login',
  passport.authenticate('admin-local', {
    failureFlash: true,
    successRedirect: '/',
    failureRedirect: '/admin/login'
  }), adminController.adminLogin
)
// router.get('/forgetPassword', userController.getForgetPassword)
// router.post('/forgetPassword', userController.forgetPassword)
// router.get('/resetPassword', userController.getResetPassword)
// router.put('/resetPassword', userController.resetPassword)
// router.post('/logout', authenticator, authenticatedAdmin, adminController.adminLogOut)

module.exports = router
