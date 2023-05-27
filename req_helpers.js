function authenticator (req) {
  return req.isAuthenticated()
}
function getUser (req) {
  return req.user
}

module.exports = {
  authenticator, getUser
}
