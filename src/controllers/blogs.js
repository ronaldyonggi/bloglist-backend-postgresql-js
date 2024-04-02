const blogsRouter = require('express').Router()
const { Blog } = require('../models')

// Middleware for finding a specific blog
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

// GET all blogs
blogsRouter.get('/', async ( req, res ) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

// GET a specific blog
blogsRouter.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

// CREATE a blog
blogsRouter.post('/', async (req, res) => {
  const user = req.user

  if (!user) {
    return res.status(400).json({ error: 'User not found!' })
  }

  try {
    const newBlog = {
      ...req.body,
      userId: user.id
    }
    const blog = await Blog.create(newBlog)
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

blogsRouter.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy()
    return res.status(204).end()
  } else {
    return res.status(400).end()
  }
})

blogsRouter.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

module.exports = blogsRouter