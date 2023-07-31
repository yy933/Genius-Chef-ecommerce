const express = require('express')
const router = express.Router()
const newletterController = require('../../controllers/newsletter-controller')
const { emailValidationSchema } = require('../../middleware/express-validator-helper')

// newsletter sign up
router.post('/', emailValidationSchema, newletterController.signUpNewsletter)

module.exports = router
