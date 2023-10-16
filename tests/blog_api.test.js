const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  {
    title: 'Miumau',
    author: 'Author 1',
    url: 'http://example.com/blog1',
    likes: 5,
  },
  {
    title: 'Purrrfect',
    author: 'Author 2',
    url: 'http://example.com/blog2',
    likes: 3,
  },
];

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
});

beforeEach(async () => {

  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('returned blogs have "id" field', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body[0]).toBeDefined();
  expect(response.body[0].id).toBeDefined();
});

afterAll(async () => {
  await mongoose.connection.close();
});
