import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import indexRouter from './index.js'

describe('Index Router', () => {
  it('should return HTML with HTMX script', async () => {
    const app = new Hono()
    app.route('/', indexRouter)

    const res = await app.request('/')
    const html = await res.text()

    expect(res.status).toBe(200)
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('<script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.6/dist/htmx.min.js"></script>')
    expect(html).toContain('<button hx-post="/clicked" hx-swap="outerHTML">')
    expect(html).toContain('Click Me')
  })
})
