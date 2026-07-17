import { useMutation } from '@tanstack/react-query'
import loginService from '../src/services/login'
import blogService from '../src/services/blogs'
import useAuthStore from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import useUIStore from '../store/useUIStore'
import persistentUser from '../src/services/persistentUser'

export const useAuth = () => {
  const { setUser } = useAuthStore()
  const { setNotification } = useUIStore()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: loginService.login,
    onSuccess: (user) => {
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)

      navigate('/')
      setNotification({
        message: `${user.name} logged in`,
        type: 'success',
      })
    },
    onError: (error) => {
      setNotification({
        message: error.response.data.error,
        type: 'error',
      })
    },
  })

  const logout = () => {
    persistentUser.removeUser()
    blogService.setToken(null)
    setUser(null)
  }

  const initializeUser = () => {
    const user = persistentUser.getUser()

    if (!user) return

    setUser(user)
    blogService.setToken(user.token)
  }

  return {
    loginMutation,
    logout,
    initializeUser,
  }
}
