const readinglistsRouter = require('express').Router();
const { ReadingList } = require('../models');

// GET all reading lists
readinglistsRouter.get('/', async (req, res) => {
  const readingLists = await ReadingList.findAll();
  res.json(readingLists);
});

// CREATE a reading list, need a logged in user and a blog
readinglistsRouter.post('/', async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(400).json({ error: 'User not found!' });
  }

  const userId = user.id;

  try {
    const { blogId } = req.body;
    const successfulCreatedReadingList = await ReadingList.create({
      blogId,
      userId,
    });
    return res.json(successfulCreatedReadingList);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = readinglistsRouter;
