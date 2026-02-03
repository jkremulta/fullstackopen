const Blog = ({ blog, user, handleLogout }) => (
  <div>
    <p>{user.name} logged in <button onClick={handleLogout}>log out</button></p>
    {blog.title} {blog.author}
  </div>  
)

export default Blog