if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const app = express()
const PORT = process.env.PORT || 3000

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
  session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false })
)
app.use(methodOverride('_method'))
app.use(flash())
app.use((req, res, next) => {
  // res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})
app.get('/', (req, res) => {
  res.render('index')
})
app.get('/menu', (req, res) => {
  res.render('menu')
})
app.get('/contact', (req, res) => {
  res.render('contact')
})

// send email from contact form
app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body
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
  return transporter.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error)
      req.flash('warning_msg', 'Message could not be sent!')
      return res.redirect('/contact')
    } else {
      req.flash('success_msg', `Thank you ${name}, your message has been sent!`)
      return res.redirect('/contact')
    }
  })
})
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
