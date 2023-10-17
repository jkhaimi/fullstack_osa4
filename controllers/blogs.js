const blogsRouter = require('express').Router();
const Blog = require('../models/blog'); 
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const tokenExtractor = require('../utils/middleware').tokenExtractor;
const userExtractor = require('../utils/middleware').userExtractor; 

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body;
  const token = request.token;

  if (!body.likes) {
    body.likes = 0;
  }

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'Title and URL are required' });
  }

  if (!token) {
    return response.status(401).json({ error: 'Token invalid' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    return response.status(401).json({ error: 'Token invalid' });
  }
});

blogsRouter.delete('/:id', tokenExtractor, async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id);
    const token = request.token;

    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (blog.user.toString() !== decodedToken.id) {
      return response.status(401).json({ error: 'You are not authorized to delete this blog' });
    }

    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    response.status(500).json({ error: 'Internal server error' });
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true }
  );
  
  if (updatedBlog) {
    response.json(updatedBlog);
  }
});

module.exports = blogsRouter;
