import { test, expect } from '@playwright/test'

test.describe('HTMX App', () => {
  test('should load page and interact with HTMX button', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000')

    // Check initial state
    const button = page.locator('button')
    await expect(button).toHaveText('Click Me')
    await expect(button).toHaveAttribute('hx-post', '/clicked')
    await expect(button).toHaveAttribute('hx-swap', 'outerHTML')

    // Click the button
    await button.click()

    // Wait for HTMX to update the button
    await page.waitForTimeout(100)

    // Check updated state
    const updatedButton = page.locator('button')
    await expect(updatedButton).toHaveText('Clicked! Click me again')

    // Check that the button has the correct styling
    const buttonStyle = await updatedButton.getAttribute('style')
    expect(buttonStyle).toContain('background-color: #4CAF50')
    expect(buttonStyle).toContain('color: white')
  })

  test('should handle multiple clicks', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Click multiple times
    for (let i = 0; i < 3; i++) {
      const button = page.locator('button')
      await button.click()
      await page.waitForTimeout(100)

      // Button should always show "Clicked! Click me again" after first click
      await expect(button).toHaveText('Clicked! Click me again')
    }
  })
})
