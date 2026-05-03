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

import {
  useMatch,
  BrowserRouter as Router,
  Routes, Route, Link,
} from 'react-router-dom'

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

  const padding = {
    padding: 5
  }

  return (
    <div>
      <Notification message ={notification.message} type={notification.type}/>
      {/* header */}
        <div>
          <Link style={padding} to="/">blogs</Link>
          <Link style={padding} to="/create">new blog</Link>
          {user === null ? (
            <Link style={padding} to="/login">login</Link>
          ) : (
            <button onClick={handleLogout}>log out</button>
          )}
        </div>

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
              blogs={blogs}
              
            />
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
        </Routes>
    </div>
  )
}

export default App