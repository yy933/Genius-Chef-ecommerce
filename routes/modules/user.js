const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')
const { authenticator, authenticatedUser } = require('../../middleware/auth')
const { profileValidationSchema, loginValidationSchema, emailValidationSchema, passwordValidationSchema, manageSettingValidationSchema } = require('../../middleware/express-validator-helper')
const { doubleCsrfProtection } = require('../../middleware/csrf-token')

router.get('/login', doubleCsrfProtection, userController.getSignIn)
router.post('/login', doubleCsrfProtection, loginValidationSchema,
  passport.authenticate('user-local', {
    failureFlash: true,
    successRedirect: '/',
    failureRedirect: '/users/login'
  }), userController.signIn
)
router.get('/signup', userController.getSignUp)
router.post('/signup', profileValidationSchema, userController.signUp)
router.get('/forgetPassword', userController.getForgetPassword)
router.post('/forgetPassword', emailValidationSchema, userController.forgetPassword)
router.get('/resetPassword', userController.getResetPassword)
router.put('/resetPassword', passwordValidationSchema, userController.resetPassword)
router.get('/profile/:userId/:section', authenticator, authenticatedUser, doubleCsrfProtection, userController.getProfile)
router.get('/profile/:userId', authenticator, authenticatedUser, userController.getProfileMain)
router.put('/profile/:userId/changePassword', authenticator, authenticatedUser, doubleCsrfProtection, passwordValidationSchema, userController.changePassword)
router.put('/profile/:userId/settings', authenticator, authenticatedUser, doubleCsrfProtection, manageSettingValidationSchema, userController.manageSettings)
router.post('/logout', authenticator, authenticatedUser, userController.logOut)
router.get('/cart/:userId', authenticator, authenticatedUser, doubleCsrfProtection, userController.getCart)
router.post('/cart/:userId', authenticator, authenticatedUser, doubleCsrfProtection, userController.sendPlansToCart)

module.exports = router
