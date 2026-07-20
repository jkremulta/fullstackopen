import Paper from '@mui/material/Paper'
import { Box, Typography, Button, TextField } from '@mui/material'

const Blog = ({
  loggedUser,
  blog,
  updateBlogMutation,
  deleteBlogMutation,
  addCommentMutation,
}) => {
  if (!blog) {
    return <div>loading...</div>
  }

  const showRemove = loggedUser?.username === blog.user.username
  const showLike = !!loggedUser

  const addComment = (event) => {
    event.preventDefault()

    const form = event.target

    addCommentMutation.mutate({
      id: blog.id,
      comment: form.comment.value,
    })

    form.reset()
  }

  return (
    <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
      <div>
        <Typography variant="h5">{blog.title}</Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          by {blog.author}
        </Typography>
        <Typography>
          <a href={blog.url}>{blog.url}</a>
        </Typography>
        <Typography>Added by {blog.user.name}</Typography>
        <div>
          <Typography>{blog.likes} likes</Typography>
        </div>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>likes {blog.likes}</Typography>

          {showLike && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                const updatedBlog = {
                  ...blog,
                  likes: blog.likes + 1,
                  user: blog.user.id,
                }

                updateBlogMutation.mutate({
                  id: blog.id,
                  newBlog: updatedBlog,
                })
              }}
            >
              like
            </Button>
          )}

          {showRemove && (
            <Button
              color="error"
              size="small"
              variant="outlined"
              onClick={() => deleteBlogMutation.mutate(blog.id)}
            >
              remove
            </Button>
          )}
        </Box>
      </div>
      <div>
        <h2>comments</h2>
        <form onSubmit={addComment}>
          <div className="flex items-center justify-center">
            <TextField name="comment" size="small" id="outlined-required" />
            <Button sx={{ ml: 1 }} variant="contained" type="submit">
              Add Comment
            </Button>
          </div>
        </form>
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </Paper>
  )
}

export default Blog
