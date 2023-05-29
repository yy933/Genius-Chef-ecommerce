const express = require('express')
const router = express.Router()

const user = require('./modules/user')
// const admin = require('./modules/admin')
const auth = require('./modules/auth')
const menu = require('./modules/menu')
const mailService = require('../helpers/email-helpers')

router.use('/users', user)
router.use('/auth', auth)
router.use('/menu', menu)
// router.use('/admin', admin)
router.get('/contact', (req, res) => {
  return res.render('contact')
})

// send email from contact form
router.post('/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject,
      html: `<h3>Name: ${name}</h3><br/><h3>Email: ${email}</h3><br/><h3>Message:</h3><br/><p>${message}</p>`
    }
    mailService(mailOptions)
    req.flash('success_msg', `Thank you ${name}, your message has been sent!`)
    return res.redirect('/contact')
  } catch (error) {
    console.log(error)
    req.flash('warning_msg', 'Message could not be sent!')
    return res.redirect('/contact')
  }
})

router.get('/', (req, res) => {
  res.render('index')
})
module.exports = router
