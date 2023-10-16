const blogsRouter = require('express').Router();
const Blog = require('../models/blog'); 

blogsRouter.get('/', async (request, response) => { 
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', (request, response) => {
  const blogData = request.body;

  if (!blogData.likes) {
    blogData.likes = 0;
  }

  if (!blogData.title || !blogData.url) {
    return response.status(400).json({ error: 'Title and URL are required' });
  }

  const blog = new Blog(blogData);

  blog.save()
    .then(result => {
      response.status(201).json(result);
    })
});

module.exports = blogsRouter;
