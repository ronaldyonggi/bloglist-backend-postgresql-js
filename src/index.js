const cors = require('cors');
const express = require('express');
require('express-async-errors');
const app = express();
const middleware = require('./utils/middleware');
const { connectToDatabase } = require('./utils/db');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const { PORT } = require('./utils/config');
const authorsRouter = require('./controllers/authors');
const readinglistsRouter = require('./controllers/readinglists');

app.use(cors());
app.use(express.json());

app.use(middleware.tokenExtractor);

app.use('/api/blogs', middleware.userExtractor, blogsRouter);
app.use('/api/readinglists', middleware.userExtractor, readinglistsRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/logout', middleware.userExtractor, logoutRouter);
app.use(middleware.errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

start();
