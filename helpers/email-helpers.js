const nodemailer = require('nodemailer')
const mailService = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD
    }
  })
  const sendMail = await transporter.sendMail(mailOptions)
  return sendMail
}

module.exports = mailService
