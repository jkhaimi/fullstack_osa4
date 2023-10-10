const blogsRouter = require('express').Router();
const Blog = require('../models/blog'); 

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs);
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error: 'Internal Server Error' });
    });
});

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then(result => {
      response.status(201).json(result);
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error: 'Internal Server Error' });
    });
});

module.exports = blogsRouter;
