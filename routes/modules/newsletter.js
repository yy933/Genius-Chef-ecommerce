const express = require('express')
const router = express.Router()
const newletterController = require('../../controllers/newsletter-controller')
const { emailValidationSchema } = require('../../helpers/express-validator-helper')

router.post('/', emailValidationSchema, newletterController.signUpNewsletter)

module.exports = router
