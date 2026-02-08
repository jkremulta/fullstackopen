const Form = ({ form, handleForm, handleCreateBlog }) => (
  <div>
    <h2>create new</h2>
    <form onSubmit={handleCreateBlog}>
      <div>
        <label>
          title:
          <input 
            type="text"
            name="title"
            value={form.title}
            onChange={handleForm}
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
            onChange={handleForm}
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
            onChange={handleForm}
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  </div>
)

export default Form