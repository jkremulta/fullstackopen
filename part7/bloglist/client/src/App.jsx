import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Form from './components/Form'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useNavigate } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './components/ErrorFallback'
import PageNotFound from './components/PageNotFound'

import {
  useMatch,
  BrowserRouter as Router,
  Routes, Route, Link,
} from 'react-router-dom'

import { Container } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({
    message: null,
    type: null
  })

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedBlogUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedBlogUserJSON) {
      const user = JSON.parse(loggedBlogUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )

      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      navigate('/')
      setNotification({
        message: `${user.name} logged in`,
        type: 'success'
      })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    } catch (error) {
      setNotification({
        message: error.response.data.error,
        type: 'error'
      })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    blogService.setToken(null)
    setUser(null)
  }


  const handleCreateBlog = async (form) => {
    const createdBlog = await blogService.create(form)
    setBlogs(blogs.concat(createdBlog))

    navigate('/')
    setNotification({
      message: `a new blog ${form.title} by ${form.author} added`,
      type: 'success'
    })

    setTimeout(() => setNotification({ message: null, type: null }), 5000)
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    setBlogs(
      blogs
        .map(b => (b.id === returnedBlog.id ? returnedBlog : b))
        .sort((a, b) => b.likes - a.likes)
    )
  }

  const handleDeleteBlog = async (id) => {
    try {
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter(b => b.id !== id))
      setNotification({
        message: 'Blog has been deleted',
        type: 'success'
      })
      navigate('/')
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    } catch(error) {
      setNotification({
        message: error.response.data.error,
        type: 'error'
      })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    }
  }

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id) : null

  return (
    <Container>
      <div>
        <Notification message ={notification.message} type={notification.type}/>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Blog App
            </Typography>
            <Button color="inherit" component={Link} to="/">blogs</Button>
            <Button color='inherit' component={Link} to="create">new blog</Button>
            {user === null ? (
              <Button color='inherit' component={Link} to="/login">login</Button>
            ) : (
              <Button color='inherit' onClick={handleLogout}>logout</Button>
            )}
          </Toolbar>

        </AppBar>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            <Route path="/blogs/:id" element={
              <Blog
                blog={blog}
                loggedUser={user}
                onDelete={handleDeleteBlog}
                onLike={handleLike}/>
            } />
            <Route path="/" element={
              <BlogList
                blogs={blogs}/>
            } />
            <Route path="/login" element={
              user === null ? (
                <Login
                  handleLogin={handleLogin}
                  username={username}
                  setUsername={setUsername}
                  password={password}
                  setPassword={setPassword}
                />
              ) : (
                <BlogList
                  blogs={blogs}
                  user={user}
                  handleDeleteBlog={handleDeleteBlog}
                  handleLike={handleLike}
                />
              )
            } />
            <Route path="/create" element={
              <Form
                handleCreateBlog={handleCreateBlog}
              />
            }
            />
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Container>
  )
}

export default App