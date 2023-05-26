const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const JWTStrategy = passportJWT.Strategy

passport.use('user-local', new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true }, (req, email, password, cb) => {
  User.findOne({ where: { email, role: 'user' } })
    .then(user => {
      if (!user) {
        return cb(null, false, req.flash('warning_msg', 'User not found.'))
      }
      return bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          return cb(null, false, req.flash('warning_msg', 'Incorrect password or email.'))
        }
        return cb(null, user)
      })
    })
    .catch(err => cb(err, false))
}))
passport.use('admin-local', new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true }, (req, email, password, cb) => {
  User.findOne({ where: { email, role: 'admin' } })
    .then(user => {
      if (!user) {
        return cb(null, false, { message: 'This email is not registered!' })
      }
      return bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          return cb(null, false, { message: 'Email or Password incorrect.' })
        }
        return cb(null, user)
      })
    })
    .catch(err => cb(err, false))
}))
passport.serializeUser(function (user, cb) {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  return User.findByPk(id)
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})
// JWT Strategy
const cookieExtractor = req => {
  let jwt = null
  if (req && req.cookies) {
    jwt = req.cookies.jwt
  }
  return jwt
}
const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_KEY
}
passport.use('jwt', new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    const { exp } = jwtPayload
    if (Date.now() / 1000 > exp) {
      cb(null, false, { message: 'Token has expired.' })
    }
    const user = await User.findByPk(jwtPayload.id)
    if (user) {
      return cb(null, user)
    } else {
      return cb(null, false)
    }
  } catch (err) {
    return cb(err, null)
  }
})
)

module.exports = passport
