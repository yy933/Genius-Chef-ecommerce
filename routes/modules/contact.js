const express = require('express')
const router = express.Router()
const contactController = require('../../controllers/contact-controller')
const { contactValidationSchema } = require('../../middleware/express-validator-helper')
const { csrfProtection, formParser } = require('../../middleware/csrf-token')

router.get('/', csrfProtection, contactController.getContact)
router.post('/', formParser, csrfProtection, contactValidationSchema, contactController.sendContact)

module.exports = router
