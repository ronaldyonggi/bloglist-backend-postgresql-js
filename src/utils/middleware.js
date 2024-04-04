const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { SECRET } = require('../utils/config')

// If request header Authorization contains a token, sets req.token to be that token
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
  }

  next()
}

const userExtractor = async (req, res, next) => {
  if (req.decodedToken) {
    const user = await User.findByPk(req.decodedToken.id)
    if (user) {
      req.user = user
    }
  }

  next()
}

// Error handler middleware
const errorHandler = (error, req, res, next) => {
  console.log('Error name: ' + error.name)
  console.log('Error message: ' + error.message)

  switch (error.name) {
    case 'SequelizeValidationError':
      return res.status(400).json({ error: 'Username needs to use email format!' })
    case 'JsonWebTokenError':
      return res.status(401).json({ error: 'Token missing or invalid!'})
    case 'TokenExpiredError':
      return res.status(401).json({ error: 'Token expired'})
    default:
      return res.status(400).json({ error })
  }

}

module.exports = {
  tokenExtractor,
  userExtractor,
  errorHandler
}