const mailService = require('../helpers/email-helpers')
const { validationResult } = require('express-validator')

const contactController = {
  getContact: (req, res, next) => {
    try {
      return res.render('contact', { csrfToken: req.csrfToken() })
    } catch (err) {
      next(err)
    }
  },
  sendContact: async (req, res, next) => {
    try {
      const { name, email, subject, message } = req.body
      const validationErrors = validationResult(req).formatWith(err => err.msg).array()
      const errors = validationErrors.map(errorMsg => ({ message: errorMsg }))
      if (errors.length) {
        return res.render('contact', {
          errors,
          name,
          email,
          subject,
          message,
          csrfToken: req.csrfToken()
        })
      }

      const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject,
        html: `<h3>Name: ${name}</h3><br/><h3>Email: ${email}</h3><br/><h3>Message:</h3><br/><p>${message}</p>`
      }
      await mailService(mailOptions)
      req.flash('success_msg', `Thank you ${name}, your message has been sent!`)
      return res.redirect('/contact')
    } catch (err) {
      req.flash('warning_msg', 'Message could not be sent!')
      res.redirect('/contact')
      return next(err)
    }
  }

}

module.exports = contactController
