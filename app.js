if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const exphbs = require('express-handlebars')
require('handlebars-helpers')(exphbs)
const methodOverride = require('method-override')
const axios = require('axios')
const session = require('express-session')
const usePassport = require('./config/passport')
const passport = require('passport')
const flash = require('connect-flash')
const path = require('path')
const priceRule = require('./helpers/price-calculation')
const bcrypt = require('bcryptjs')
const validator = require('email-validator')
const { authenticator } = require('./middleware/auth')
const mailService = require('./helpers/email-helpers')
const crypto = require('crypto')
const { User, ResetToken } = require('./models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const app = express()
const PORT = process.env.PORT || 8080

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
  session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true })
)
usePassport(app)

app.use(methodOverride('_method'))
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  return next()
})

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  res.render('login')
})
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))
app.post('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error)
    }
    req.flash('success_msg', 'Successfully logged out.')
    return res.redirect('/login')
  })
})
app.get('/signup', (req, res) => {
  res.render('signup')
})
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    const regex = /^(?=.*\d)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}$/
    if (!name || !email || !password || !confirmPassword) {
      errors.push({ message: 'All fields are required.' })
    }
    if (!validator.validate(email)) {
      errors.push({ message: 'Please provide a valid email.' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: 'Make sure password and confirm password match.' })
    }
    if (!regex.test(password)) {
      errors.push({ message: 'The password must contain at least 8 and maximum 16 characters, including at least 1 uppercase, 1 lowercase, and one number.' })
    }
    if (errors.length) {
      console.log(errors)
      return res.render('signup', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    const user = await User.findOne({ where: { email } })
    if (user) {
      errors.push({ message: 'This email has already been registered.' })
      return res.render('signup', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
    req.flash('success_msg', 'Successfully created an account!')
    return res.redirect('/login')
  } catch (error) {
    console.log(error)
    req.flash('warning_msg', 'Something went wrong, please try again!')
    return res.render('signup')
  }
})

app.get('/forgetPassword', (req, res) => {
  return res.render('forget-password')
})
app.post('/forgetPassword', async (req, res) => {
  try {
    const email = req.body.email
    const user = await User.findOne({ where: { email } })
    if (!user) {
      req.flash('warning_msg', `Email ${email} is not valid. Please try again.`)
      return res.redirect('/forgetPassword')
    }
    await ResetToken.update({ used: 1 }, { where: { userEmail: email } })
    const token = crypto.randomBytes(80).toString('base64')
    const expiration = new Date(new Date().getTime() + (60 * 10 * 1000))
    await ResetToken.create({
      userEmail: email,
      expiration,
      token,
      used: 0
    })
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your password reset instruction from Genius Chef',
      html: `<h1 style="color:#196F3D; text-align:center">Reset Password</h1>
      <h3>Dear ${user.name},</h3>
      <p style="font-size: 14px">Please click the link below to reset your password:</p>
      <a style="color:#196F3D; font-weight:bold; font-size:20px" href="${process.env.CLIENT_URL}/resetPassword?token=${encodeURIComponent(token)}&email=${email}">Reset Password</a>
      <p style="font-size: 14px">Link will expire in 10 minutes.</p>
      <br>
      <p style="font-size: 14px; color:#616A6B;">If you didn't make this request, please ignore this email or <a href="${process.env.CLIENT_URL}/contact">contact us</a>.</p>
      <br>
      <h3>Sincerely,<br>Genius Chef Customer Service Team</h3>`
    }
    await mailService(mailOptions)
    req.flash('success_msg', `An email has been sent to ${email}`)
    return res.redirect('/login')
  } catch (error) {
    console.log(error)
    return res.redirect('/forgetPassword')
  }
})
app.get('/resetPassword', async (req, res) => {
  try {
    const { token, email } = req.query
    await ResetToken.destroy({
      where: {
        [Op.or]: [{ used: 1 }, { expiration: { [Op.lt]: Sequelize.fn('NOW') } }]
      }
    })
    const unusedToken = await ResetToken.findOne({
      where: {
        userEmail: email,
        expiration: { [Op.gt]: Sequelize.fn('NOW') },
        token,
        used: 0
      }
    })
    if (!unusedToken) {
      req.flash('warning_msg', 'Reset password link has expired. Please make a request again.')
      return res.redirect('/forgetPassword')
    }
    return res.render('reset-password', {
      email,
      token
    })
  } catch (error) {
    console.log(error)
    res.redirect('/forgetPassword')
  }
})
app.post('/resetPassword', async (req, res) => {
  try {
    const { password, confirmPassword, email, token } = req.body
    const regex = /^(?=.*\d)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}$/
    if (!regex.test(password)) {
      req.flash('warning_msg', 'The password must contain at least 8 and maximum 16 characters, including at least 1 uppercase, 1 lowercase, and one number.')
      return res.redirect('back')
    }
    if (password !== confirmPassword) {
      req.flash('warning_msg', 'Make sure password and confirm password match.')
      return res.redirect('back')
    }

    const unusedToken = await ResetToken.findOne({
      where: {
        userEmail: email,
        expiration: { [Op.gt]: Sequelize.fn('NOW') },
        token,
        used: 0
      }
    })
    if (!unusedToken) {
      req.flash('warning_msg', 'Reset password link has expired. Please make a request again.')
      return res.redirect('/forgetPassword')
    }
    await Promise.all([
      ResetToken.update({ used: 1 }, { where: { userEmail: email } }),
      bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.update({
          password: hash
        }, {
          where: {
            email
          }
        }))])
    req.flash('success_msg', 'Password has been successfully reset!')
    return res.redirect('/login')
  } catch (error) {
    console.log(error)
    return res.redirect('/forgetPassword')
  }
})
app.get('/profile', (req, res) => {
  res.render('user/profile')
})
app.get('/contact', (req, res) => {
  return res.render('contact')
})

// send email from contact form
app.post('/contact', (req, res) => {
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
app.get('/menu', (req, res) => {
  return res.redirect('/menu/classic')
})
app.get('/menu/:preference', async (req, res) => {
  try {
    let tags
    const preference = req.params.preference
    if (preference === 'classic') {
      tags = ''
    } else {
      tags = preference
    }
    const recipes = await axios({
      method: 'get',
      url: 'https://api.spoonacular.com/recipes/random',
      headers: { 'Content-Type': 'application/json' },
      params: {
        limitLicense: true,
        number: 30,
        tags,
        apiKey: process.env.API_KEY
      }
    })
    const recipesData = recipes.data.recipes.map(recipe => ({
      id: recipe.id,
      dishName: recipe.title,
      vegetarian: recipe.vegetarian,
      glutenFree: recipe.glutenFree,
      dairyFree: recipe.dairyFree,
      cookingTime: recipe.readyInMinutes,
      servings: recipe.servings,
      image: recipe.image || 'https://images.unsplash.com/photo-1633878353697-f751870d1d76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      instruction: Object.assign({}, recipe.analyzedInstructions[0]?.steps.map(s => s.step) || ['Instructions are currently unavailable, please check the full recipe below for more details.']),
      ingredient: Object.assign({}, recipe.extendedIngredients?.map(i => i.original) || ['Ingredients are currently unavailable, please check the full recipe below for more details.']),
      fullDetailsUrl: recipe.spoonacularSourceUrl || '/'
    }))
    res.render('menu', {
      recipesData,
      path: `/menu/${preference}`
    })
  } catch (error) {
    console.error('Request failed:', error)
    return res.render('menu', { message: 'Could not find the menu!' })
  }
})

app.get('/plans', (req, res) => {
  res.render('plans')
})
app.get('/cart', (req, res) => {
  res.render('user/cart')
})
app.post('/cart', (req, res) => {
  try {
    let { menu, preference, servings, meals, mealTotal } = req.body
    console.log(req.body)
    if (!mealTotal) {
      mealTotal = priceRule(servings, meals)
    }
    res.render('user/cart', {
      menu,
      preference,
      servings,
      meals,
      mealTotal
    })
  } catch (error) {
    console.log(error)
    req.flash('warning_msg', 'Plans could not be added to cart, please try again!')
    return res.redirect('/plans')
  }
})
app.post('/order', (req, res) => {
  res.render('confirm')
})
app.get('/', authenticator, (req, res) => {
  res.render('index')
})
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
