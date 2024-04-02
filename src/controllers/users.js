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

// MODIFY a user. Used for modifying a user's username
usersRouter.put('/:username', async (req, res) => {
  const usernameParams = req.params.username
  const newUsername = req.body.newUsername

  try {
    const userToModify = await User.findOne({ where: { username: usernameParams } })
    if (!userToModify) {
      return res.status(404).json({ error: 'User not found!'})
    }
    await userToModify.update({ username: newUsername })
    await userToModify.save()
    return res.json(userToModify)
  } catch (error) {
    return res.status(400).json({ error: "Something is wrong with modifying user's username!" })
  }

})

module.exports = usersRouter