import { useState } from 'react'

const Form = ({ handleCreateBlog }) => {

  const [form, setForm] = useState({
    title: '',
    author: '',
    url: ''
  })

  const createBlog = event => {
    event.preventDefault()
    handleCreateBlog(form)
    setForm({
      title: '',
      author: '',
      url: ''
    })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <div>
          <label>
            title:
            <input 
              type="text"
              name="title"
              value={form.title}
              onChange={(event) => setForm({
                ...form,
                [event.target.name]: event.target.value
              })}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input 
              type="text"
              name="author"
              value={form.author}
              onChange={(event) => setForm({
                ...form,
                [event.target.name]: event.target.value
              })}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type="text"
              name="url" 
              value={form.url}
              onChange={(event) => setForm({
                ...form,
                [event.target.name]: event.target.value
              })}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )

}

export default Form