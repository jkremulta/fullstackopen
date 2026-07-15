const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

let token
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  // create new user
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'password123'
  }
  await api.post('/api/users').send(newUser)

  // get token from new user
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'password123' })

  token = loginResponse.body.token
})

test('blog returns the correct amount of posts', async () => {
  const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(blogs.body.length, helper.initialBlogs.length)
})

test('blog unique identifier is named id', async () => {
  const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  blogs.body.forEach(blog => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

test('a blog can be added', async () => {
  const newBlog = {
    title: 'JK Blog',
    author: 'Joshua Kenta',
    url: 'www.jkhirako.com',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(b => b.author)
  assert(contents.includes('Joshua Kenta'))
})

test('blog creation fails with invalid token', async () => {
  const newBlog = {
    title: 'JK Blog',
    author: 'Joshua Kenta',
    url: 'www.jkhirako.com',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer wrongtoken')
    .send(newBlog)
    .expect(401)
})

test('blog creation fails without token', async () => {
  const newBlog = {
    title: 'JK Blog',
    author: 'Joshua Kenta',
    url: 'www.jkhirako.com',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})


test('verify that if likes property is empty, defaults to value 0', async () => {
  const newBlog = {
    title: 'JK Blog',
    author: 'Joshua Kenta',
    url: 'www.jkhirako.com',
  }

  const returnedBlog = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(returnedBlog.body.likes, 0)
})

test('if title & url properties are missing, responds 400 bad request', async () => {
  const newBlog = {
    author: 'Joshua Kenta',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('verify that a single blog can be deleted', async () => {
  const newBlog = {
    title: 'JK Blog',
    author: 'Joshua Kenta',
    url: 'www.jkhirako.com',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtStart = await helper.blogsInDb()
  const blogToBeDeleted = blogsAtStart.at(-1)

  await api
    .delete(`/api/blogs/${blogToBeDeleted.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  const contents = blogsAtEnd.map(b => b.title)
  assert(!contents.includes('JK Blog'))
})

test('successfully updates the likes of a blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = {
    ...blogsAtStart[0],
    likes: blogsAtStart[0].likes + 1
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  const updatedBlog = blogsAtEnd.find(
    b => b.id === blogToUpdate.id
  )

  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes)
})

// user test
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails when username is less than 3 characters', async () => {
    const newUser = {
      username: 'jk',
      name: 'Joshua Kenta',
      password: 'test'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('is shorter than the minimum allowed length'))
  })

  test('creation fails when password is less than 3 characters', async () => {
    const newUser = {
      username: 'jke',
      name: 'Joshua Kenta',
      password: 'te'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('password is too short'))
  })
})


after(async () => {
  await mongoose.connection.close()
})