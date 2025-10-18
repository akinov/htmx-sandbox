import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import clickedRouter from './index.js'

describe('Clicked Router', () => {
  it('should return HTML with styled button', async () => {
    const app = new Hono()
    app.route('/', clickedRouter)

    const res = await app.request('/clicked', { method: 'POST' })
    const html = await res.text()

    expect(res.status).toBe(200)
    expect(html).toContain('<button hx-post="/clicked" hx-swap="outerHTML"')
    expect(html).toContain('style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px;"')
    expect(html).toContain('Clicked! Click me again')
  })
})
