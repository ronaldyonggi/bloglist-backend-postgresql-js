const authorsRouter = require('express').Router();

const { Blog } = require('../models');
const { sequelize } = require('../utils/db');

authorsRouter.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      // Count the number of blogs using the blog id
      [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    group: 'author',
    order: [['likes', 'DESC']],
  });

  res.json(authors);
});

module.exports = authorsRouter;
