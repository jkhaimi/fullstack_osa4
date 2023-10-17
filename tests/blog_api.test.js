const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app);

// const initialUsers = [
//   {
//     username: 'jkhaimi',
//     _id: new mongoose.Types.ObjectId(),
//   },
//   {
//     username: 'matti',
//     _id: new mongoose.Types.ObjectId(),
//   },
// ]

const initialBlogs = [
  {
    title: 'Miumau',
    author: 'Author 1',
    url: 'http://example.com/blog1',
    likes: 5,
    // user: initialUsers[0]._id, 
  },
  {
    title: 'Purrrfect',
    author: 'Author 2',
    url: 'http://example.com/blog2',
    likes: 3,
    // user: initialUsers[0]._id,
  },
];

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
});

beforeEach(async () => {

  // await User.deleteMany({})
  // let userObject = new User(initialUsers[0])
  // await userObject.save()
  // userObject = new User(initialUsers[1])
  // await userObject.save()

  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('The returning of blogs', () => {
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
})

describe('The adding of blogs', () => {
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
})

describe('The deletion and changing of blogs', () => {
// Testataan blogin poistamista
test('deleting a blog by ID', async () => {
  const initialBlogs = await api.get('/api/blogs');
  const blogToDelete = initialBlogs.body[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204);

  const blogsAfterDelete = await api.get('/api/blogs');
  const blogIds = blogsAfterDelete.body.map(blog => blog.id);

  expect(blogIds).not.toContain(blogToDelete.id);
});

// Testataan että blogin päivittäminen toimii
test('updating a blog by ID', async () => {
  const initialBlogs = await api.get('/api/blogs');
  const blogToUpdate = initialBlogs.body[0]; 
  const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200);

  expect(response.body.likes).toEqual(updatedBlog.likes);
});
})

// Käyttäjän luomiseen liittyvät testit
describe('User creation and validation', () => {
  test('Creating a valid user returns a 201 status', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'testpassword',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // Add further validation if needed
  });

  test('Creating a user with a short username returns a 400 status and appropriate error message', async () => {
    const invalidUser = {
      username: 'ab',
      name: 'Invalid User',
      password: 'testpassword',
    };

    const response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('Username and password must be at least 3 characters long');
  });

  test('Creating a user with a non-unique username returns a 400 status and appropriate error message', async () => {
    const initialUser = {
      username: 'existinguser',
      name: 'Existing User',
      password: 'testpassword',
    };

    await api
      .post('/api/users')
      .send(initialUser)
      .expect(201);

    const duplicateUser = {
      username: 'existinguser',
      name: 'Duplicate User',
      password: 'testpassword',
    };

    const response = await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('Username must be unique');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
