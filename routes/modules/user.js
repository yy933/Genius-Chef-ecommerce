const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')
const { authenticator, authenticatedUser } = require('../../middleware/auth')
const { signUpValidationSchema } = require('../../helpers/express-validator-helper')


router.get('/login', userController.getSignIn)
router.post('/login',
  passport.authenticate('user-local', {
    failureFlash: true,
    successRedirect: '/',
    failureRedirect: '/users/login'
  }), userController.signIn
)
router.get('/signup', userController.getSignUp)
router.post('/signup', signUpValidationSchema, userController.signUp)
router.get('/forgetPassword', userController.getForgetPassword)
router.post('/forgetPassword', userController.forgetPassword)
router.get('/resetPassword', userController.getResetPassword)
router.put('/resetPassword', userController.resetPassword)
router.get('/profile/:userId/:section', authenticator, authenticatedUser, userController.getProfile)
router.get('/profile/:userId', authenticator, authenticatedUser, userController.getProfileMain)
router.put('/profile/:userId/changePassword', authenticator, authenticatedUser, userController.changePassword)
router.put('/profile/:userId/settings', authenticator, authenticatedUser, userController.manageSettings)
router.post('/logout', authenticator, authenticatedUser, userController.logOut)
router.get('/cart/:userId', authenticator, authenticatedUser, userController.getCart)
router.post('/cart/:userId', authenticator, authenticatedUser, userController.sendPlansToCart)

module.exports = router
