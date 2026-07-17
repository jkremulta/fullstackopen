import { TextField, Button } from '@mui/material'
import { useField } from './UseField'

const Form = ({ createBlogMutation }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const createBlog = (event) => {
    event.preventDefault()

    createBlogMutation.mutate({
      title: title.data.value,
      author: author.data.value,
      url: url.data.value,
    })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <div>
          <TextField
            name="title"
            sx={{ width: '40ch' }}
            size="small"
            margin="dense"
            id="outline-required"
            label="title"
            {...title.data}
          ></TextField>
        </div>
        <div>
          <TextField
            name="author"
            sx={{ width: '40ch' }}
            size="small"
            margin="dense"
            id="outline-required"
            label="author"
            {...author.data}
          ></TextField>
        </div>
        <div>
          <TextField
            name="url"
            sx={{ width: '40ch' }}
            size="small"
            margin="dense"
            id="outline-required"
            label="url"
            {...url.data}
          ></TextField>
        </div>
        <Button sx={{ mt: 2 }} variant="contained" type="submit">
          create
        </Button>
      </form>
    </div>
  )
}

export default Form
