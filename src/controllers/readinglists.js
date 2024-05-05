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
  const { blogId } = req.body;

  const alreadyExist = await ReadingList.findOne({
    where: {
      userId: userId,
      blogId: blogId,
    },
  });

  // Handle case if the user already added the blog to the user list. Prevents duplicate record
  if (alreadyExist) {
    return res
      .status(409)
      .json({ error: 'blog already added to reading list by this user!' });
  }

  const successfulCreatedReadingList = await ReadingList.create({
    blogId,
    userId,
  });
  return res.json(successfulCreatedReadingList);
});

// PUT a reading list, changing its "read" attribute from false to true, or vice versa
readinglistsRouter.put('/:id', async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(400).json({ error: 'User not found!' });
  }

  const userId = user.id;
  const blogId = req.params.id;
  const { read } = req.body;

  const matchedUserBlogCombination = await ReadingList.findOne({
    where: {
      userId: userId,
      blogId: blogId,
    },
  });

  if (!matchedUserBlogCombination) {
    return res.status(404).json({ error: 'reading list not found' });
  }

  matchedUserBlogCombination.read = read;
  await matchedUserBlogCombination.save();

  res.json(matchedUserBlogCombination);
});

module.exports = readinglistsRouter;
