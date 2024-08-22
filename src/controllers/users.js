const usersRouter = require('express').Router();
const { User, Blog, } = require('../models');
const bcrypt = require('bcrypt');

// GET all users
usersRouter.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: {
      exclude: ['passwordHash'],
    },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  });
  return res.json(users);
});

// GET a specific user
usersRouter.get('/:id', async (req, res) => {
  const where = {};
  if (req.query.read) {
    where.read = `${req.query.read}`;
  }

  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['createdAt', 'updatedAt', 'userId'] },
      through: {
        attributes: ['read', 'id'],
        where,
      },
    },
  });
  return res.json(user);
});

// CREATE a new user
usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = {
    username,
    name,
    passwordHash,
  };

  const user = await User.create(newUser);
  return res.json(user);
});

// MODIFY a user. Used for modifying a user's username
usersRouter.put('/:username', async (req, res) => {
  const usernameParams = req.params.username;
  const newUsername = req.body.newUsername;

  try {
    const userToModify = await User.findOne({
      where: { username: usernameParams },
    });
    if (!userToModify) {
      return res.status(404).json({ error: 'User not found!' });
    }
    await userToModify.update({ username: newUsername });
    await userToModify.save();
    return res.json(userToModify);
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Something is wrong with modifying user username!' });
  }
});

module.exports = usersRouter;
