const mailService = require('../helpers/email-helpers')
const contactController = {
  getContact: (req, res, next) => {
    try { return res.render('contact') } catch (err) { next(err) }
  },
  sendContact: (req, res, next) => {
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
    } catch (err) {
      req.flash('warning_msg', 'Message could not be sent!')
      res.redirect('/contact')
      return next(err)
    }
  }

}

module.exports = contactController
