import { test, expect } from '@playwright/test'

test.describe('Todo MVP', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the app title and empty list initially', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('TODO')
    await expect(page.locator('.todo-item')).toHaveCount(0)
  })

  test('should add a todo and display it', async ({ page }) => {
    const input = page.locator('.todo-input input')
    const button = page.locator('.todo-input button')

    await input.fill('学习 Playwright')
    await button.click()

    await expect(page.locator('.todo-item')).toHaveCount(1)
    await expect(page.locator('.todo-title')).toHaveText('学习 Playwright')
  })

  test('should add a todo by pressing Enter', async ({ page }) => {
    const input = page.locator('.todo-input input')

    await input.fill('按回车添加')
    await input.press('Enter')

    await expect(page.locator('.todo-item')).toHaveCount(1)
    await expect(page.locator('.todo-title')).toHaveText('按回车添加')
  })

  test('should toggle todo completion', async ({ page }) => {
    const input = page.locator('.todo-input input')
    await input.fill('切换状态')
    await input.press('Enter')

    const checkbox = page.locator('.todo-item input[type="checkbox"]')
    await checkbox.click()

    await expect(page.locator('.todo-item')).toHaveClass(/completed/)

    await checkbox.click()
    await expect(page.locator('.todo-item')).not.toHaveClass(/completed/)
  })

  test('should edit a todo title', async ({ page }) => {
    const input = page.locator('.todo-input input')
    await input.fill('旧标题')
    await input.press('Enter')

    const title = page.locator('.todo-title')
    await title.dblclick()

    const editInput = page.locator('.edit-input')
    await editInput.fill('新标题')
    await editInput.press('Enter')

    await expect(page.locator('.todo-title')).toHaveText('新标题')
  })

  test('should remove a todo', async ({ page }) => {
    const input = page.locator('.todo-input input')
    await input.fill('待删除')
    await input.press('Enter')

    await expect(page.locator('.todo-item')).toHaveCount(1)

    const removeButton = page.locator('button[aria-label="删除"]')
    await removeButton.click()

    await expect(page.locator('.todo-item')).toHaveCount(0)
  })

  test('should persist todos across page reloads', async ({ page }) => {
    const input = page.locator('.todo-input input')
    await input.fill('持久化任务')
    await input.press('Enter')

    await expect(page.locator('.todo-title')).toHaveText('持久化任务')

    await page.reload()

    await expect(page.locator('.todo-title')).toHaveText('持久化任务')
  })
})
