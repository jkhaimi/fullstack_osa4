const blogsRouter = require('express').Router();
const Blog = require('../models/blog'); 
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body;

  const user = await User.findById(body.userId)

  if (!body.likes) {
    body.likes = 0;
  }

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'Title and URL are required' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  blog.save()
    .then(result => {
      response.status(201).json(result);
    })
});

blogsRouter.delete('/:id', async (request, response) => {

    const deletedBlog = await Blog.findByIdAndRemove(request.params.id);
    
    if (deletedBlog) {
      response.status(204).end(); 
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
