const { Newsletter } = require('../models')
const mailService = require('../helpers/email-helpers')
const { validationResult } = require('express-validator')
const newsletterController = {
  signUpNewsletter: async (req, res, next) => {
    try {
      const { email } = req.body
      const validationErrors = validationResult(req).formatWith(err => err.msg).array()
      const errors = validationErrors.map(errorMsg => ({ message: errorMsg }))
      if (errors.length) {
        return res.render('index', {
          errors,
          email
        })
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
      req.flash('success_msg', 'Successfully subscribed!')
      return res.redirect('/')
    } catch (err) { next(err) }
  }
}

module.exports = newsletterController
