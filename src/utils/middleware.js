const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { SECRET } = require('../utils/config');
const { getAsync } = require('./redis');

// If request header Authorization contains a token, sets req.token to be that token
const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    // fetch the token part after 'bearer '
    const tokenBeforeDecoded = authorization.substring(7);
    // fetch the user id associated with the token from redis
    const userIdInRedis = await getAsync(String(tokenBeforeDecoded));
    // If token exists in redis, proceed
    if (userIdInRedis) {
      req.decodedToken = jwt.verify(tokenBeforeDecoded, SECRET);
    }
  }

  next();
};

const userExtractor = async (req, res, next) => {
  if (req.decodedToken) {
    const user = await User.findByPk(req.decodedToken.id);
    if (user) {
      req.user = user;
    }
  }

  next();
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.log('Error name: ' + err.name);
  console.log('Error message: ' + err.message);

  switch (err.name) {
    case 'SequelizeValidationError':
      return res
        .status(400)
        .json({ error: 'Username needs to use email format!' });
    case 'JsonWebTokenError':
      return res.status(401).json({ error: 'Token missing or invalid!' });
    case 'TokenExpiredError':
      return res.status(401).json({ error: 'Token expired' });
    default:
      return res.status(400).json({ error: err });
  }
};

module.exports = {
  tokenExtractor,
  userExtractor,
  errorHandler,
};
