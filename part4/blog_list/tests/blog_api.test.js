const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
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
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(b => b.author)
  assert(contents.includes('Joshua Kenta'))
})

test('verify that if likes property is empty, defaults to value 0', async () => {
  const newBlog = {
    title: 'JK Blog',
    author: 'Joshua Kenta',
    url: 'www.jkhirako.com',
  }

  const returnedBlog = await api
    .post('/api/blogs')
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
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('verify that a single blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToBeDeleted = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToBeDeleted.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

  const contents = blogsAtEnd.map(b => b.title)
  assert(!contents.includes('React patterns'))
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


after(async () => {
  await mongoose.connection.close()
})