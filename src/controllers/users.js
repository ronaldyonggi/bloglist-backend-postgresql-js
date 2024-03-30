const usersRouter = require('express').Router()
const { User, Blog } = require('../models')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

// CREATE a new user
usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = {
    username, name, passwordHash
  }
  try {
    const user = await User.create(newUser)
    return res.json(user)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

module.exports = usersRouter