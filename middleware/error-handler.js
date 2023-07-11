const errorHandler = {
  errorLogger: (err, req, res, next) => {
    console.log(`Error: ${err.message}`)
    next(err)
  },
  errorResponder: (err, req, res, next) => {
    res.header('Content-Type', 'application/json')
    const status = err.statusCode || 400
    if (err instanceof Error) {
      return res.status(status).render('error', {
        status,
        errName: err.name || 'Error',
        errMessage: err.message || 'Something went wrong'
      })
    } else {
      return res.status(status).render('error', {
        status,
        errName: 'Error',
        errMessage: err
      })
    }
  }
}

module.exports = errorHandler
