const express = require('express')
const router = express.Router()

const user = require('./modules/user')
const auth = require('./modules/auth')
const menu = require('./modules/menu')
const contact = require('./modules/contact')
const order = require('./modules/order')
const admin = require('./modules/admin')
const newsletter = require('./modules/newsletter')
const errorHandler = require('../middleware/error-handler')
const cookieParser = require('cookie-parser')
const { doubleCsrfProtection } = require('../middleware/csrf-token')

router.use(cookieParser(process.env.CSRF_COOKIE_SECRET))
// router.use(doubleCsrfProtection)
router.use('/users', user)
router.use('/auth', auth)
router.use('/menu', menu)
router.use('/contact', contact)
router.use('/orders', order)
router.use('/admin', admin)
router.use('/newsletter', newsletter)

// non-authenticated routes
router.get('/plans', doubleCsrfProtection, (req, res, next) => {
  try {
    return res.render('plans', { csrfToken: req.csrfToken() })
  } catch (err) { next(err) }
})

router.get('/instructions', (req, res, next) => {
  try {
    return res.render('how-it-works')
  } catch (err) { next(err) }
})

router.get('/', (req, res, next) => {
  try {
    return res.render('index')
  } catch (err) { next(err) }
})

router.use(errorHandler.errorLogger)
router.use(errorHandler.errorResponder)
router.get('*', (req, res) => {
  res.status(404).render('error', {
    status: 404,
    errName: 'Error',
    errMessage: 'Page not found!'
  })
})

module.exports = router
