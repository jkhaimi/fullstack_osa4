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


// Testataan että blogit palautetaan halutussa muodossa
test('blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});


// Testataan että jokaisella blogilla on id muuttuja
test('returned blogs have "id" field', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body[0]).toBeDefined();
  expect(response.body[0].id).toBeDefined();
});


// Testataan että blogi voidaan lisätä onnistuneesti
test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'testBlog',
    author: 'tester',
    url: 'www.testblog.com',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain(
    'testBlog'
  )
})


// Testataan että blogi ilman likejä saa arvokseen 0
test('likes field is set to 0 if not provided', async () => {
  const newBlog = {
    title: 'testBlog2',
    author: 'tester2',
    url: 'www.testblog2.com',
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(response.body.likes).toBe(0);
});

// Testataan että jos blogi ilman otsikkoa tai urlia lisätään nii ei onnistu
test('blog without a title or an url is not added', async () => {
  const newBlog = {
    author: 'tester3'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

afterAll(async () => {
  await mongoose.connection.close();
});
