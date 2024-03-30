const cors = require('cors')
const express = require('express')
require('express-async-errors')
const app = express()

const {  connectToDatabase } = require('./utils/db')
const blogsRouter = require('./controllers/blogs')
const { PORT } = require('./utils/config')
const errorHandler = require('./utils/middleware')

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

start()