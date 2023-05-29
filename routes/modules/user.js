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
router.post('/logout', authenticator, authenticatedUser, userController.logOut)

module.exports = router
