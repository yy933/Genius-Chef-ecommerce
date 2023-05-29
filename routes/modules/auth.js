const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
router.get('/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }))
router.get('/google', passport.authenticate('google', {
  scope: ['email', 'profile']
}))

router.get('/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }))
router.get('/twitter',
  passport.authenticate('twitter'))

module.exports = router
