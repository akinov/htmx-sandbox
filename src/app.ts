import { Hono } from 'hono'
import indexRouter from './routes/index/index.js'
import clickedRouter from './routes/clicked/index.js'

const app = new Hono()

// ルートの登録
app.route('/', indexRouter)
app.route('/', clickedRouter)

export default app
