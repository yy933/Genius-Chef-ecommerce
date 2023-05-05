const nodemailer = require('nodemailer')
const contactFormSend = async (name, email, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD
    }
  })
  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject,
    html: `<h3>Name: ${name}</h3><br/><h3>Email: ${email}</h3><br/><h3>Message:</h3><br/><p>${message}</p>`
  }
  const sendMail = await transporter.sendMail(mailOptions)
  return sendMail
}

module.exports = contactFormSend
