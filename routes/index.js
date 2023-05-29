const express = require('express')
const router = express.Router()

const { authenticator, authenticatedUser, authenticatedAdmin } = require('../middleware/auth')
const user = require('./modules/user')
const admin = require('./modules/admin')
const auth = require('./modules/auth')
const mailService = require('../helpers/email-helpers')
const axios = require('axios')

router.use('/users', user)
router.use('/auth', auth)
// router.use('/admin', admin)
router.get('/contact', (req, res) => {
  return res.render('contact')
})

// send email from contact form
router.post('/contact', (req, res) => {
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
router.get('/menu', (req, res) => {
  return res.redirect('/menu/classic')
})
router.get('/menu/:preference', async (req, res) => {
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

router.get('/', (req, res) => {
  res.render('index')
})
module.exports = router
