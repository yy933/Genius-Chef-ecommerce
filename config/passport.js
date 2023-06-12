const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User, Subscriptions, sequelize } = require('../models')
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
    .then(user => {
      const userData = user.toJSON()
      delete userData.password
      cb(null, userData)
    }
    )
    .catch(err => cb(err))
})

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/auth/google/callback'
},
async function (accessToken, refreshToken, profile, cb) {
  const t = await sequelize.transaction()
  try {
    const { name, email } = profile._json
    const user = await User.findOne({ where: { email } })
    if (user) return cb(null, user)
    const randomPassword = Math.random().toString(36).slice(-12)
    const hashedPassword = bcrypt.hashSync(randomPassword, bcrypt.genSaltSync(10))
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    }, { transaction: t })
    await Subscriptions.create({
      active: false,
      userId: newUser.id
    }, { transaction: t })
    await t.commit()
    return cb(null, newUser)
  } catch (err) {
    console.log(err)
    await t.rollback()
    return cb(err, false)
  }
}
))

// Twitter Strategy
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CLIENT_ID,
  consumerSecret: process.env.TWITTER_CLIENT_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/twitter/callback'
},
async function (token, tokenSecret, profile, cb) {
  const t = await sequelize.transaction()
  try {
    const { name, id_str } = profile._json
    const email = name + '@twitter'
    const user = await User.findOne({ where: { twitterId: id_str } })
    if (user) return cb(null, user)
    const randomPassword = Math.random().toString(36).slice(-12)
    const hashedPassword = bcrypt.hashSync(randomPassword, bcrypt.genSaltSync(10))
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      twitterId: id_str
    }, { transaction: t })
    await Subscriptions.create({
      active: false,
      userId: newUser.id
    }, { transaction: t })
    await t.commit()

    return cb(null, newUser)
  } catch (err) {
    console.log(err)
    await t.rollback()
    return cb(err, false)
  }
}
))

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
