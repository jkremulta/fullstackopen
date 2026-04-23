const Login = ({ handleLogin, username, setUsername, password, setPassword }) => (
  <div>
    <h2>log in to application</h2>

    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input 
            type="text"
            value={username}
            onChange = {({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input 
            type="text"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  </div>
)

export default Login