const express = require('express')
const router = express.Router()
const menuController = require('../../controllers/menu-controller')

router.get('/', menuController.getMenuMain)
router.get('/:preference', menuController.getMenuPreference)

module.exports = router
