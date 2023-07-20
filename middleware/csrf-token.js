const csrf = require('csurf')
const bodyParser = require('body-parser')
const csrfProtection = csrf({ cookie: true })
const formParser = bodyParser.urlencoded({ extended: false })

module.exports = { csrfProtection, formParser }
