if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const exphbs = require('express-handlebars')
require('handlebars-helpers')(exphbs)
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const router = require('./routes')
const flash = require('connect-flash')
const path = require('path')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

const app = express()
const PORT = process.env.PORT || 8080

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.use(helmet({
  contentSecurityPolicy: false
}))
app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: true, // set to true on production
      sameSite: 'none'
    }
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  return next()
})
app.use('/', router)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
