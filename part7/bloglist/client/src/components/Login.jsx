import { TextField, Button } from '@mui/material'
import { useField } from './UseField'

const Login = ({ loginMutation }) => {
  const username = useField('text')
  const password = useField('password')

  const handleLogin = (event) => {
    event.preventDefault()

    loginMutation.mutate({
      username: username.data.value,
      password: password.data.value,
    })

    username.reset()
    password.reset()
  }

  return (
    <div>
      <h1>Log in to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            id="standard-required"
            variant="standard"
            label="username"
            {...username.data}
          ></TextField>
        </div>
        <div>
          <TextField
            id="standard-password-input"
            type="password"
            variant="standard"
            label="password"
            {...password.data}
          ></TextField>
        </div>
        <Button sx={{ mt: 1 }} variant="contained" type="submit">
          login
        </Button>
      </form>
    </div>
  )
}

export default Login
