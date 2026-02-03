import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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
      setUsername('')
      setPassword('')
    } catch {
      alert('wrong credentials')
    }
  }

  const handleLogout = () => {
  window.localStorage.removeItem('loggedBlogUser')
  setUser(null)
  }


  if (user == null) {
    return (
      <Login handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog user={user} handleLogout={handleLogout} key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App