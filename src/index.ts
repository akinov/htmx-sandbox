import app from './app.js'

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}
