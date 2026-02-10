import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Form from './components/Form'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({
    message: null,
    type: null
  })
  const blogFormRef = useRef()

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
    blogFormRef.current.toggleVisibility()

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
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    } catch(error) {
      setNotification({
        message: error.response.data.error,
        type: 'error'
      })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message ={notification.message} type={notification.type}/>
        <Login handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>
      </div>
    )
  }

  return (
    <div>
      <Notification message ={notification.message} type={notification.type}/>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>log out</button></p>
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <Form handleCreateBlog={handleCreateBlog}/>
      </Togglable>


      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} onLike={handleLike} onDelete={handleDeleteBlog} />
      )}

    </div>
  )
}

export default App