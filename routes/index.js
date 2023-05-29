const express = require('express')
const router = express.Router()

const user = require('./modules/user')
// const admin = require('./modules/admin')
const auth = require('./modules/auth')
const menu = require('./modules/menu')
const contact = require('./modules/contact')


router.use('/users', user)
router.use('/auth', auth)
router.use('/menu', menu)
router.use('/contact', contact)
// router.use('/admin', admin)



router.get('/', (req, res) => {
  res.render('index')
})
module.exports = router
