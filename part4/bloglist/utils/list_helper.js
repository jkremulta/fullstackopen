const totalLikes = (blogs) => {
  const sum = (acc, blog) => acc + blog.likes
  return blogs.reduce(sum, 0)
}

const favoriteBlog = (blogs) => {
  const favorite = (leadingBlog, currBlog) => leadingBlog.likes > currBlog.likes ? leadingBlog : currBlog
  return blogs.reduce(favorite, blogs[0])
}

module.exports = {
  totalLikes,
  favoriteBlog
}