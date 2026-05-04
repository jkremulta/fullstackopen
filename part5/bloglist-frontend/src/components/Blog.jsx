import Paper from '@mui/material/Paper'
import { Box, Typography, Button } from '@mui/material'

const Blog = ({ loggedUser, blog, onLike, onDelete }) => {
  if (!blog) {
    return <div>loading...</div>
  }

  const showRemove = loggedUser?.username === blog.user.username
  const showLike = !!loggedUser


  return (
    <Paper
      elevation={1}
      sx={{ p:2, mt:2 }}>
      <div>
        <Typography variant="h5">{blog.title}</Typography>
        <Typography sx={{ color:'text.secondary' }}>by {blog.author}</Typography>
        <Typography><a href={blog.url}>{blog.url}</a></Typography>
        <Typography>Added by {blog.user.name}</Typography>
        <div>
          <Typography>{blog.likes} likes</Typography>
        </div>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>likes {blog.likes}</Typography>

          {showLike && (
            <Button size='small' variant='outlined' onClick={() => onLike(blog)}>
                like
            </Button>
          )}

          {showRemove && (
            <Button color='error' size='small' variant='outlined' onClick={() => onDelete(blog.id)}>
                remove
            </Button>
          )}
        </Box>
      </div>
    </Paper>
  )}

export default Blog