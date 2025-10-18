import { describe, it, expect } from 'vitest'
import app from '../app.js'

describe('Security Headers', () => {
  it('should include CSP header', async () => {
    const res = await app.request('/')
    const cspHeader = res.headers.get('Content-Security-Policy')

    expect(cspHeader).toBeDefined()
    expect(cspHeader).toContain("default-src 'self'")
    expect(cspHeader).toContain("script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net")
  })

  it('should include X-Frame-Options header', async () => {
    const res = await app.request('/')
    const frameOptions = res.headers.get('X-Frame-Options')

    expect(frameOptions).toBe('DENY')
  })

  it('should include X-Content-Type-Options header', async () => {
    const res = await app.request('/')
    const contentTypeOptions = res.headers.get('X-Content-Type-Options')

    expect(contentTypeOptions).toBe('nosniff')
  })

  it('should include X-XSS-Protection header', async () => {
    const res = await app.request('/')
    const xssProtection = res.headers.get('X-XSS-Protection')

    expect(xssProtection).toBe('1; mode=block')
  })

  it('should include Referrer-Policy header', async () => {
    const res = await app.request('/')
    const referrerPolicy = res.headers.get('Referrer-Policy')

    expect(referrerPolicy).toBe('strict-origin-when-cross-origin')
  })

  it('should include Permissions-Policy header', async () => {
    const res = await app.request('/')
    const permissionsPolicy = res.headers.get('Permissions-Policy')

    expect(permissionsPolicy).toBeDefined()
    expect(permissionsPolicy).toContain('camera=()')
    expect(permissionsPolicy).toContain('microphone=()')
  })
})

describe('CSRF Protection', () => {
  it('should set SameSite cookie for CSRF protection', async () => {
    const res = await app.request('/')
    const setCookieHeader = res.headers.get('Set-Cookie')

    expect(setCookieHeader).toBeDefined()
    expect(setCookieHeader).toContain('SameSite=Strict')
    expect(setCookieHeader).toContain('HttpOnly')
    expect(setCookieHeader).toContain('Secure')
  })

  it('should handle POST requests with CSRF protection', async () => {
    const res = await app.request('/clicked', { method: 'POST' })

    // 開発環境では基本的なSameSite保護のみ
    expect(res.status).toBe(200)
  })
})

describe('CORS Configuration', () => {
  it('should handle OPTIONS requests', async () => {
    const res = await app.request('/', { method: 'OPTIONS' })

    expect(res.status).toBe(200)
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('GET, POST, PUT, DELETE, OPTIONS')
  })

  it('should set CORS headers for allowed origins', async () => {
    const res = await app.request('/', {
      headers: {
        'Origin': 'http://localhost:3000'
      }
    })

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000')
    expect(res.headers.get('Access-Control-Allow-Credentials')).toBe('true')
  })
})
