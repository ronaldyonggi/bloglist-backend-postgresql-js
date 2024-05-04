const readinglistsRouter = require('express').Router();
const { ReadingList } = require('../models');

readinglistsRouter.post('/', async (req, res) => {
  // const user = req.user;

  // if (!user) {
  //   return res.status(400).json({ error: 'User not found!' });
  // }

  try {
    // console.log(user.id);
    // const newReadingList = {
    //   userId: user.id,
    //   blogId: req.body.blogId,
    // };

    const { blogId, userId } = req.body;
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
