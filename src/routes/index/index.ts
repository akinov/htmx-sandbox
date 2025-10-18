import { Hono } from 'hono'

const indexRouter = new Hono()

// ルートエンドポイント
indexRouter.get('/', (c) => {
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

export default indexRouter
