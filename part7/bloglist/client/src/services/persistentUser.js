const key = 'loggedBlogUser'

const getUser = () => {
  const userJSON = window.localStorage.getItem(key)

  if (!userJSON) {
    return null
  }

  return JSON.parse(userJSON)
}

const saveUser = (user) => {
  window.localStorage.setItem(key, JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem(key)
}

export default {
  getUser,
  saveUser,
  removeUser,
}
