import { Hono } from 'hono'
import indexRouter from './routes/index/index.js'
import clickedRouter from './routes/clicked/index.js'
import formRouter from './routes/form/index.js'
import { securityHeaders, csrfProtection, corsConfig } from './middleware/security.js'

// テスト用のコメント

const app = new Hono()

// セキュリティミドルウェアの適用
app.use('*', securityHeaders)
app.use('*', corsConfig)
app.use('*', csrfProtection)

// ルートの登録
app.route('/', indexRouter)
app.route('/', clickedRouter)
app.route('/', formRouter)

export default app
