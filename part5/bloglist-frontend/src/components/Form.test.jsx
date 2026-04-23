import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Form from './Form'

test('form calls handleCreateBlog with correct details when submitted', async () => {
  const user = userEvent.setup()
  const handleCreateBlog = vi.fn()

  render(<Form handleCreateBlog={handleCreateBlog} />)

  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')
  const submitButton = screen.getByText('create')

  await user.type(titleInput, 'Testing React')
  await user.type(authorInput, 'Jane Doe')
  await user.type(urlInput, 'https://example.com')

  await user.click(submitButton)

  expect(handleCreateBlog.mock.calls).toHaveLength(1)
  expect(handleCreateBlog.mock.calls[0][0]).toEqual({
    title: 'Testing React',
    author: 'Jane Doe',
    url: 'https://example.com'
  })
})