const express = require('express')
const router = express.Router()
const contactController = require('../../controllers/contact-controller')
const { contactValidationSchema } = require('../../middleware/express-validator-helper')
const { doubleCsrfProtection } = require('../../middleware/csrf-token')

router.get('/', doubleCsrfProtection, contactController.getContact)
router.post('/', doubleCsrfProtection, contactValidationSchema, contactController.sendContact)

module.exports = router
