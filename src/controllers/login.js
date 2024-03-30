const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const { SECRET } = require('../utils/config')
const User = require('../models/user')
const bcrypt = require('bcrypt')

// LOGIN functionality
loginRouter.post('/', async (req, res) => {

  const user = await User.findOne({
    where: {
      username: req.body.username
    }
  })

  // Check if user is found AND password is correct
  const passwordCorrect = !user
    ? false
    : await bcrypt.compare(req.body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(
    userForToken,
    SECRET,
    { expiresIn: 60 * 60 }
  )

  return res
    .status(200)
    .send({
      token,
      username: user.username,
      name: user.name
    })
})

module.exports = loginRouter