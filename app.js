const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });


console.log('MONGODB_URI:', process.env.MONGODB_URI);


app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);

app.get('/', (request, response) => {
  response.send('<h1>Kissa</h1>');
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
