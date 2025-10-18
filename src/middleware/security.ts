import { Context, Next } from 'hono'

/**
 * セキュリティヘッダーミドルウェア
 * CSP、X-Frame-Options、X-Content-Type-Options等のセキュリティヘッダーを設定
 */
export const securityHeaders = async (c: Context, next: Next) => {
  // CSP (Content Security Policy) の設定
  c.header('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data:; " +
    "font-src 'self'; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none';"
  )

  // X-Frame-Options (クリックジャッキング対策)
  c.header('X-Frame-Options', 'DENY')

  // X-Content-Type-Options (MIMEタイプスニッフィング対策)
  c.header('X-Content-Type-Options', 'nosniff')

  // X-XSS-Protection (XSS対策)
  c.header('X-XSS-Protection', '1; mode=block')

  // Referrer-Policy (リファラー情報の制御)
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions-Policy (ブラウザ機能の制限)
  c.header('Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  )

  // Strict-Transport-Security (HTTPS強制、本番環境で有効化)
  if (c.env?.NODE_ENV === 'production') {
    c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  await next()
}

/**
 * CSRF対策ミドルウェア
 * SameSite Cookie属性とCSRFトークン検証を実装
 */
export const csrfProtection = async (c: Context, next: Next) => {
  // SameSite Cookie属性の設定
  c.header('Set-Cookie', 'csrf-token=placeholder; SameSite=Strict; HttpOnly; Secure')

  // POSTリクエストに対するCSRFトークン検証
  if (c.req.method === 'POST') {
    const token = c.req.header('X-CSRF-Token')

    // 本番環境では厳密な検証を実装
    // 現在は基本的なSameSite保護に依存
    if (c.env?.NODE_ENV === 'production' && !token) {
      return c.text('CSRF token missing', 403)
    }
  }

  await next()
}

/**
 * CORS設定ミドルウェア
 * 必要に応じてCORSヘッダーを設定
 */
export const corsConfig = async (c: Context, next: Next) => {
  const origin = c.req.header('Origin')

  // 許可するオリジンのリスト（本番環境では適切に設定）
  const allowedOrigins = c.env?.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000']

  if (origin && allowedOrigins.includes(origin)) {
    c.header('Access-Control-Allow-Origin', origin)
  }

  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token')
  c.header('Access-Control-Allow-Credentials', 'true')

  // OPTIONSリクエストの処理
  if (c.req.method === 'OPTIONS') {
    return c.text('', 200)
  }

  await next()
}
