// Make a test, which checks that the component displaying
// a blog renders the blog's title and author, but does not render its URL
// or number of likes by default.

// Add CSS classes to the component to help the testing as necessary.

import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

const blog = {
    title: 'Testing React',
    author: 'Jane Doe',
    url: 'https://example.com',
    likes: 5,
    user: { name: 'Jane' }
  }

test('renders title and author, but not url or likes by default', () => {
  
  render(
    <Blog
      blog={blog}
    />
  )

  const title = screen.getByText('Testing React Jane Doe')
  expect(title).toBeVisible()


  const url = screen.queryByText('https://example.com')
  expect(url).toBeNull()

  const likes = screen.queryByText(5)
  expect(likes).toBeNull()
})

test('checks the blogs URL and number of likes are shown when the button is clicked', async () => {
  const user = userEvent.setup()

  render(
    <Blog
      blog={blog}
    />
  )

  const button = screen.getByText('view')

  await user.click(button)

  const url = screen.getByText('https://example.com')
  expect(url).toBeVisible()

  const likes = screen.getByText('likes 5')
  expect(likes).toBeVisible()
})

test('ensures if the like button is pressed twice, event hander component receives two', async () => {
  const user = userEvent.setup()
  const likeMock = vi.fn()

   render(
    <Blog
      blog={blog}
      onLike={likeMock}
    />
  )

  const button = screen.getByText('view')
  await user.click(button)

  const like_button = await screen.getByText('like')
  await user.click(like_button)
  await user.click(like_button)

  expect(likeMock.mock.calls).toHaveLength(2)

})