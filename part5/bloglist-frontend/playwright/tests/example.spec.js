const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: "Test Account",
        username: "testuser",
        password: "testpassword"
      }
    })
    
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()

    await expect(
      page.getByRole('button', { name: 'login' })
    ).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'testpassword')

      await expect(page.getByText('Test Account logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'wronguser', 'wrongpassword')

      const notificationDiv = page.locator('.notification')
      await expect(notificationDiv).toContainText('invalid username or password')
      await expect(notificationDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'testpassword')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      
      await page.getByLabel('title:').fill('How To Play Tchoukball')
      await page.getByLabel('author:').fill('Joshua Kenta')
      await page.getByLabel('url').fill('www.arsenalstchoukball.com')

      await page.getByRole('button', { name: 'create' }).click()

      const notificationDiv = page.locator('.notification')
      await expect(notificationDiv).toContainText('a new blog How To Play Tchoukball by Joshua Kenta')
      await expect(notificationDiv).toHaveCSS('color', 'rgb(0, 128, 0)')

      await expect(
        page.locator('.blog').filter({ hasText: 'How To Play Tchoukball' })
        ).toBeVisible()
    })

    test('the blog can be liked', async ({ page }) => {
    // create blog first
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByLabel('title:').fill('How To Play Tchoukball')
      await page.getByLabel('author:').fill('Joshua Kenta')
      await page.getByLabel('url').fill('www.arsenalstchoukball.com')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'view' }).click()

      await expect(page.getByText('likes 0')).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('user is able to delete the blog', async ({ page }) => {
      // create blog first
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByLabel('title:').fill('How To Play Tchoukball')
      await page.getByLabel('author:').fill('Joshua Kenta')
      await page.getByLabel('url').fill('www.arsenalstchoukball.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'remove' }).click()

      const notificationDiv = page.locator('.notification')
      await expect(notificationDiv).toContainText('Blog has been deleted')
      await expect(notificationDiv).toHaveCSS('color', 'rgb(0, 128, 0)')

      await expect(
        page.locator('.blog').filter({ hasText: 'How To Play Tchoukball' })
        ).not.toBeVisible()
    })

    test('only user who added the blog sees delete button', async ({ page, request }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByLabel('title:').fill('How To Play Tchoukball')
      await page.getByLabel('author:').fill('Joshua Kenta')
      await page.getByLabel('url').fill('www.arsenalstchoukball.com')

      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'view' }).click()

      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
      await page.getByRole('button', { name: 'log out' }).click()

      await request.post('/api/users', {
        data: {
          name: 'Dummy User',
          username: 'dummyuser',
          password: 'dummypassword'
        }
      })

      await loginWith(page, 'dummyuser', 'dummypassword')

      await page.getByRole('button', { name: 'view' }).click()

      await expect(
        page.getByRole('button', { name: 'remove' })
      ).not.toBeVisible()

    })

    test('blogs are sorted descendingly according to likes', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByLabel('title:').fill('How To Play Tchoukball')
      await page.getByLabel('author:').fill('Joshua Kenta')
      await page.getByLabel('url').fill('www.arsenalstchoukball.com')
      await page.getByRole('button', { name: 'create' }).click()
      const tchoukballBlog = page
        .locator('.blog', { hasText: 'How To Play Tchoukball Joshua Kenta' })

       // likes the tchoukball blog
      await tchoukballBlog.getByRole('button', { name: 'view' }).click()

      await tchoukballBlog.getByRole('button', { name: 'like' }).click()
      await expect(tchoukballBlog).toContainText('likes 1')

      await tchoukballBlog.getByRole('button', { name: 'hide' }).click()

      // creates another blog
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title:').fill('How To Play Basketball')
      await page.getByLabel('author:').fill('Thirdy Dora')
      await page.getByLabel('url').fill('www.nba.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(
        page.locator('.blog').filter({ hasText: 'How To Play Basketball Thirdy Dora' })
        ).toBeVisible()

      const basketballBlog = page
        .locator('.blog', { hasText: 'How To Play Basketball Thirdy Dora' })
      
      // checks if the tchoukball blog comes first
      const firstBlog = page.locator('.blog').first()
      await expect(firstBlog).toContainText('How To Play Tchoukball Joshua Kenta')

      // adds two likes on basketball blog and check if it comes first
      await basketballBlog.getByRole('button', { name: 'view' }).click()

      await basketballBlog.getByRole('button', { name: 'like' }).click()
      await expect(basketballBlog).toContainText('likes 1')

      await basketballBlog.getByRole('button', { name: 'like' }).click()
      await expect(basketballBlog).toContainText('likes 2')

      const newFirstBlog = await page.locator('.blog').first()
      await expect(newFirstBlog).toContainText('How To Play Basketball')
    })
  })
})