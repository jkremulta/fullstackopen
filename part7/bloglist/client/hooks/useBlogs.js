import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import useUIStore from '../store/useUIStore'
import { useNavigate } from 'react-router-dom'

import blogService from '../src/services/blogs'

export const useBlogs = () => {
  const { setNotification } = useUIStore()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['blogs'] })

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (createdBlog) => {
      setNotification({
        message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        type: 'success',
      })
      navigate('/')
      invalidate()
    },
  })

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, newBlog }) => blogService.update(id, newBlog),
    onSuccess: () => invalidate(),
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      setNotification({
        message: 'Blog has been deleted',
        type: 'success',
      })
      navigate('/')
      invalidate()
    },
    onError: (error) =>
      setNotification({
        message: error.response.data.error,
        type: 'error',
      }),
  })

  return {
    blogs: blogsQuery.data ?? [],

    // mutations
    createBlogMutation,
    updateBlogMutation,
    deleteBlogMutation,
  }
}
