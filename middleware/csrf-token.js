const { doubleCsrf } = require('csrf-csrf')
const csrfOptions = {
  getSecret: (req) => req.session.secret,
  cookieName: '__Host-psifi.x-csrf-token',
  cookieOptions: { sameSite: 'strict', secure: true, signed: true },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getTokenFromRequest: (req) => req.body._csrf
}
const { doubleCsrfProtection } = doubleCsrf(csrfOptions)

module.exports = { doubleCsrfProtection }
