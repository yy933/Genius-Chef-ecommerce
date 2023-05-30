const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')
const { authenticator, authenticatedUser } = require('../../middleware/auth')

router.get('/login', userController.getSignIn)
router.post('/login',
  passport.authenticate('user-local', {
    failureFlash: true,
    successRedirect: '/',
    failureRedirect: '/users/login'
  }), userController.signIn
)
router.get('/signup', userController.getSignUp)
router.post('/signup', userController.signUp)
router.get('/forgetPassword', userController.getForgetPassword)
router.post('/forgetPassword', userController.forgetPassword)
router.get('/resetPassword', userController.getResetPassword)
router.put('/resetPassword', userController.resetPassword)
router.get('/profile/:userId', authenticator, authenticatedUser, userController.getProfile)
router.post('/logout', authenticator, authenticatedUser, userController.logOut)
router.get('/cart', authenticator, authenticatedUser, userController.getCart)
router.post('/cart', authenticator, authenticatedUser, userController.sendPlansToCart)
router.post('/order', authenticator, authenticatedUser, userController.sendOrder)
router.put('/changePassword/:userId', authenticator, authenticatedUser, userController.changePassword)
module.exports = router
