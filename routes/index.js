const express = require('express')
const router = express.Router()
const { Newsletter } = require('../models')
const mailService = require('../helpers/email-helpers')
const user = require('./modules/user')
const auth = require('./modules/auth')
const menu = require('./modules/menu')
const contact = require('./modules/contact')
const order = require('./modules/order')
const admin = require('./modules/admin')
const errorHandler = require('../middleware/error-handler')
const validator = require('email-validator')

router.use('/users', user)
router.use('/auth', auth)
router.use('/menu', menu)
router.use('/contact', contact)
router.use('/orders', order)
router.use('/admin', admin)

// non-authenticated routes
router.get('/plans', (req, res, next) => {
  try {
    return res.render('plans')
  } catch (err) { next(err) }
})

router.get('/instructions', (req, res, next) => {
  try {
    return res.render('how-it-works')
  } catch (err) { next(err) }
})

router.post('/newsletter', async (req, res, next) => {
  try {
    const { email } = req.body
    const errors = []
    if (!email) {
      errors.push({ message: 'All fields are required.' })
    }
    if (!validator.validate(email)) {
      errors.push({ message: 'Please provide a valid email.' })
    }
    if (errors.length) {
      return res.redirect('/')
    }
    const user = await Newsletter.findOne({ where: { email } })
    if (user) {
      errors.push({ message: 'You have already subscribed!' })
      return res.render('index', {
        errors,
        email
      })
    }
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Thank you for subscribing Genius Chef newsletter!',
      html: `<h1 style="color:#196F3D; text-align:center">Welcome!</h1>
            <h3>Dear ${email},</h3>
            <p style="font-size: 14px">Thank you for subscribing Genius Chef newsletter. We'll keep you updated with news, offers, recipes, and more! Stay tuned and cook with us!</p>
            <img src="https://images.unsplash.com/photo-1489743342057-3448cc7c3bb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=412&q=80">
            <br>
            <p style="font-size: 14px; color:#616A6B;">Please <a href="${process.env.BASE_URL}/contact">contact us</a> if you have any questions.</p>
            <br>
            <h3>Sincerely,<br>Genius Chef Customer Service Team</h3>`
    }
    await Promise.all([Newsletter.create({ email }), mailService(mailOptions)])
    req.flash('success_msg', 'Successfully created an account!')
    return res.redirect('/')
  } catch (err) { next(err) }
})
router.get('/', (req, res, next) => {
  try { return res.render('index') } catch (err) { next(err) }
})

router.use(errorHandler.errorLogger)
router.use(errorHandler.errorResponder)
router.get('*', (req, res) => {
  res.status(404).render('error', {
    status: 404,
    errName: 'Error',
    errMessage: 'Page not found!'
  })
})

module.exports = router
