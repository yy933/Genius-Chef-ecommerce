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
const contactFormSend = require('./helpers/email-helpers')
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
  return res.render('contact')
})

// send email from contact form
app.post('/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    contactFormSend(name, email, subject, message)
    req.flash('success_msg', `Thank you ${name}, your message has been sent!`)
    return res.redirect('/contact')
  } catch (error) {
    console.log(error)
    req.flash('warning_msg', 'Message could not be sent!')
    return res.redirect('/contact')
  }
})
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
