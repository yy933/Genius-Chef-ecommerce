if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const exphbs = require('express-handlebars')
require('handlebars-helpers')(exphbs)
const methodOverride = require('method-override')
const axios = require('axios')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const priceRule = require('./helpers/price-calculation')
const bcrypt = require('bcryptjs')
const contactFormSend = require('./helpers/email-helpers')
const app = express()
const PORT = process.env.PORT || 8080

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
app.get('/login', (req, res) => {
  res.render('login')
})
app.get('/signup', (req, res) => {
  res.render('signup')
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
      image: recipe.image,
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
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
