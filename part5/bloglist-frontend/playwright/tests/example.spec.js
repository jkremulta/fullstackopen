const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/testing/reset')
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
})