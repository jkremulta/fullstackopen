const Blog = ({ loggedUser, blog, onLike, onDelete }) => {
  if (!blog) {
    return <div>loading...</div>
  }

  const showRemove = blog.user.username === loggedUser.username
  

  return (
        <div>
          <h2>{blog.title}: {blog.author}</h2>
          <a href={blog.url}>{blog.url}</a>
          <div>likes {blog.likes}
            <button onClick={() => onLike(blog)}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {showRemove && (
            <button onClick={() => onDelete(blog.id)}>remove</button>
          )}
        </div>
      ) }

export default Blog