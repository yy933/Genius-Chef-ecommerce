const express = require('express')
const router = express.Router()

const user = require('./modules/user')
// const admin = require('./modules/admin')
const auth = require('./modules/auth')
const menu = require('./modules/menu')
const contact = require('./modules/contact')
// const order = require('./modules/order')

router.use('/users', user)
router.use('/auth', auth)
router.use('/menu', menu)
router.use('/contact', contact)
// router.use('/order', order)
// router.use('/admin', admin)

router.get('/plans', (req, res, next) => {
  try {
    return res.render('plans')
  } catch (err) { next(err) }
})
router.get('/', (req, res, next) => {
  try { return res.render('index') } catch (err) { next(err) }
})
module.exports = router
