const jwt = require('jsonwebtoken');
const loginRouter = require('express').Router();
const { SECRET } = require('../utils/config');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { setAsync } = require('../utils/redis');

// LOGIN functionality
loginRouter.post('/', async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  // Check if user is found AND password is correct
  const passwordCorrect = !user
    ? false
    : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET, { expiresIn: 60 * 60 });

  // Store token as active sessions to redis
  setAsync(String(token), String(user.id));
  setAsync(String(user.id), String(token));

  return res.status(200).send({
    token,
    username: user.username,
    name: user.name,
    id: user.id,
  });
});

module.exports = loginRouter;
