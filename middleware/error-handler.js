const errorHandler = {
  errorLogger: (err, req, res, next) => {
    console.log(`Error: ${err.message}`)
    next(err)
  },
  errorResponder: (err, req, res, next) => {
    res.header('Content-Type', 'application/json')
    const status = err.status || 400
    if (err instanceof Error) {
      res.status(status).render('error', {
        status,
        errName: err.name || 'Error',
        errMessage: err.message
      })
    } else {
      res.status(status).render('error', {
        status,
        errName: 'Error',
        errMessage: err
      })
    }
  }
}

module.exports = errorHandler
