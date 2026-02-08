import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Form from './components/Form'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({
    title: '',
    author: '',
    url: ''
  })
  const [notification, setNotification] = useState({
    message: null,
    type: null
  })

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

  const handleForm = ({ target }) => {
    setForm({
      ...form,
      [target.name]: target.value
    })
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    const createdBlog = await blogService.create(form)
    setBlogs(blogs.concat(createdBlog))

    setNotification({
        message: `a new blog ${form.title} by ${form.author} added`,
        type: 'success'
      })
    setTimeout(() => setNotification({ message: null, type: null }), 5000)

    setForm({
      title: '',
      author: '',
      url: ''
    })
  }

  if (user == null) {
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

      <Form form={form} handleForm={handleForm} handleCreateBlog={handleCreateBlog}/>

      {blogs.map(blog =>
        <Blog user={user} handleLogout={handleLogout} key={blog.id} blog={blog} />
      )}

    </div>
  )
}

export default App