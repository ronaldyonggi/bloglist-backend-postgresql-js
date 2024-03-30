// Error handler middleware
const errorHandler = (error, req, res, next) => {
  console.log('Error name: ' + error.name)
  console.log('Error message: ' + error.message)

  res.status(400).end()
  return next(error)
}

module.exports = errorHandler