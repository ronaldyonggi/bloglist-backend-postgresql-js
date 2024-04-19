const config = require('./utils/config');
const { Sequelize, QueryTypes } = require('sequelize');

const sequelize = new Sequelize(config.DATABASE_URL);

const main = async () => {
  try {
    await sequelize.authenticate();
    const blogs = await sequelize.query('SELECT * FROM blogs', {
      type: QueryTypes.SELECT,
    });
    blogs.map((b) => {
      console.log(`${b.author}: '${b.title}', ${b.likes} likes`);
    });
    sequelize.close();
  } catch (error) {
    console.log('Unable to connect to DB:', error);
  }
};

main();
