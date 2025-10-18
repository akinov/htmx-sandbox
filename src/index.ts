import { Hono } from 'hono'

const app = new Hono()

// ルートエンドポイント
app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.6/dist/htmx.min.js"></script>
</head>
<body>
    <button hx-post="/clicked" hx-swap="outerHTML">
        Click Me
    </button>
</body>
</html>
  `)
})

// HTMX用のエンドポイント
app.post('/clicked', (c) => {
  return c.html(`
    <button hx-post="/clicked" hx-swap="outerHTML" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px;">
        Clicked! Click me again
    </button>
  `)
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}
