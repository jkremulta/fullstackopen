const User = ({ selectedUser }) => {
  if (!selectedUser) {
    return null
  }

  return (
    <div>
      <h2>{selectedUser.name}</h2>
      <h2>added blogs</h2>
      <ul>
        {selectedUser.blogs.map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
