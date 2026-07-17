import { useEffect } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Form from './components/Form'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import Togglable from './components/Togglable'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './components/ErrorFallback'
import PageNotFound from './components/PageNotFound'
import { Users } from './components/Users'

import useUIStore from '../store/useUIStore'
import { useBlogs } from '../hooks/useBlogs'
import useAuthStore from '../store/useAuthStore'
import { useAuth } from '../hooks/useAuth'

import {
  useMatch,
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom'

import { Container } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const App = () => {
  const { blogs, createBlogMutation, updateBlogMutation, deleteBlogMutation } =
    useBlogs()

  const { loginMutation, logout, initializeUser } = useAuth()

  const { user } = useAuthStore()

  const { notification } = useUIStore()

  useEffect(() => {
    initializeUser()
  }, [])

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  return (
    <Container>
      <div>
        <Notification message={notification.message} type={notification.type} />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Blog App
            </Typography>
            <Button color="inherit" component={Link} to="/">
              blogs
            </Button>
            <Button color="inherit" component={Link} to="users">
              users
            </Button>
            <Button color="inherit" component={Link} to="create">
              new blog
            </Button>
            {user === null ? (
              <Button color="inherit" component={Link} to="/login">
                login
              </Button>
            ) : (
              <Button color="inherit" onClick={logout}>
                logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            <Route
              path="/blogs/:id"
              element={
                <Blog
                  blog={blog}
                  loggedUser={user}
                  deleteBlogMutation={deleteBlogMutation}
                  updateBlogMutation={updateBlogMutation}
                />
              }
            />
            <Route path="/" element={<BlogList blogs={blogs} />} />
            <Route
              path="/login"
              element={
                user === null ? (
                  <Login loginMutation={loginMutation} />
                ) : (
                  <BlogList blogs={blogs} />
                )
              }
            />
            <Route path="/users" element={<Users />} />
            <Route
              path="/create"
              element={<Form createBlogMutation={createBlogMutation} />}
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Container>
  )
}

export default App
