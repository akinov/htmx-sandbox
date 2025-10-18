import { describe, it, expect } from 'vitest'
import app from './app.js'

describe('App', () => {
  it('should register routes correctly', async () => {
    // Test root route
    const rootRes = await app.request('/')
    expect(rootRes.status).toBe(200)

    const rootHtml = await rootRes.text()
    expect(rootHtml).toContain('Click Me')

    // Test clicked route
    const clickedRes = await app.request('/clicked', { method: 'POST' })
    expect(clickedRes.status).toBe(200)

    const clickedHtml = await clickedRes.text()
    expect(clickedHtml).toContain('Clicked! Click me again')
  })
})
