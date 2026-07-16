import { TextField, Button } from "@mui/material";

const Login = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => (
  <div>
    <h1>Log in to application</h1>
    <form onSubmit={handleLogin}>
      <div>
        <TextField
          id="standard-required"
          variant="standard"
          label="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        ></TextField>
      </div>
      <div>
        <TextField
          id="standard-password-input"
          type="password"
          variant="standard"
          label="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        ></TextField>
      </div>
      <Button sx={{ mt: 1 }} variant="contained" type="submit">
        login
      </Button>
    </form>
  </div>
);

export default Login;
