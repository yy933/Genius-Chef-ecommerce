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
const contactFormSend = require('./helpers/email-helpers')
const { User } = require('./models')
const { error } = require('console')
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
    if (!name || !email || !password || !confirmPassword) {
      errors.push({ message: 'All fields are required.' })
    }
    if (!validator.validate(email)) {
      errors.push({ message: 'Please provide a valid email.' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: 'Make sure password and confirm password match.' })
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
    contactFormSend(name, email, subject, message)
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
