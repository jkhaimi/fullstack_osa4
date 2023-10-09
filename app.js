const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = 'mongodb+srv://jessehaimi:MRwest19@cluster0.dw6u4kq.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
    response.send(`<h1>Kissa</h1>`)
})

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body);
  
    blog
      .save()
      .then(result => {
        console.log('Saved blog:', result); // Log the result object
        response.status(201).json(result);
      })
      .catch(error => {
        response.status(400).json({ error: error.message });
      });
  });

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})