const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')
const { authenticator, authenticatedUser } = require('../../middleware/auth')
const priceRule = require('../../helpers/price-calculation')

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
router.post('/resetPassword', userController.resetPassword)
router.get('/profile', authenticator, authenticatedUser, userController.getProfile)
router.post('/logout', authenticator, authenticatedUser, userController.logOut)
router.get('/cart', authenticator, authenticatedUser, userController.getCart)
router.post('/cart', authenticator, authenticatedUser, userController.sendPlansToCart)
router.post('/order', authenticator, authenticatedUser, userController.sendOrder)
router.get('/plans', authenticator, authenticatedUser, userController.getPlans)

module.exports = router
