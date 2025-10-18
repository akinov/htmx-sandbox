import { Hono } from 'hono'

const clickedRouter = new Hono()

// HTMX用のエンドポイント
clickedRouter.post('/clicked', (c) => {
  return c.html(`
    <button hx-post="/clicked" hx-swap="outerHTML" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px;">
        Clicked! Click me again
    </button>
  `)
})

export default clickedRouter
