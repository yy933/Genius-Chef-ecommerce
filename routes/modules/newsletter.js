const express = require('express')
const router = express.Router()
const newletterController = require('../../controllers/newsletter-controller')

router.post('/', newletterController.signUpNewsletter)

module.exports = router
