const express = require('express')
const router = express.Router()
const menuController = require('../../controllers/menu-controller')

// get menu
router.get('/', menuController.getMenuMain)
router.get('/:preference', menuController.getMenuPreference)

module.exports = router
