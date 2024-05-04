const Blog = require('./blog');
const ReadingList = require('./reading_list');
const User = require('./user');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: 'marked_blogs' });
Blog.belongsToMany(User, { through: ReadingList, as: 'users_marked' });

module.exports = {
  Blog,
  User,
  ReadingList
};
