import { Hono } from 'hono'
import indexRouter from './routes/index.js'
import clickedRouter from './routes/clicked.js'

const app = new Hono()

// ルートの登録
app.route('/', indexRouter)
app.route('/', clickedRouter)

export default app
