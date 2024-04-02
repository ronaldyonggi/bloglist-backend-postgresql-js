const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')
// If request header Authorization contains a token, sets req.token to be that token
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
  }

  next()
}

// Error handler middleware
const errorHandler = (error, req, res, next) => {
  console.log('Error name: ' + error.name)
  console.log('Error message: ' + error.message)

  res.status(400).end()
  return next(error)
}

  tokenExtractor,
