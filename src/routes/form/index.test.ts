import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import formRouter from './index.js'

describe('Form Router', () => {
  it('should display form page', async () => {
    const app = new Hono()
    app.route('/', formRouter)

    const res = await app.request('/form')
    const html = await res.text()

    expect(res.status).toBe(200)
    expect(html).toContain('入力検証テストフォーム')
    expect(html).toContain('<form hx-post="/form/submit"')
    expect(html).toContain('name="name"')
    expect(html).toContain('name="email"')
    expect(html).toContain('name="age"')
    expect(html).toContain('name="message"')
  })

  it('should validate form data successfully', async () => {
    const app = new Hono()
    app.route('/', formRouter)

    const validData = {
      name: '田中太郎',
      email: 'tanaka@example.com',
      age: '25',
      message: 'テストメッセージです'
    }

    const res = await app.request('/form/submit', {
      method: 'POST',
      body: new URLSearchParams(validData)
    })

    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain('✅ 送信成功！')
    expect(html).toContain('田中太郎')
    expect(html).toContain('tanaka@example.com')
    expect(html).toContain('25歳')
  })

  it('should reject invalid email format', async () => {
    const app = new Hono()
    app.route('/', formRouter)

    const invalidData = {
      name: '田中太郎',
      email: 'invalid-email',
      age: '25',
      message: 'テストメッセージです'
    }

    const res = await app.request('/form/submit', {
      method: 'POST',
      body: new URLSearchParams(invalidData)
    })

    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain('❌ 入力エラー')
    expect(html).toContain('正しいメールアドレスを入力してください')
  })

  it('should reject invalid age', async () => {
    const app = new Hono()
    app.route('/', formRouter)

    const invalidData = {
      name: '田中太郎',
      email: 'tanaka@example.com',
      age: '150',
      message: 'テストメッセージです'
    }

    const res = await app.request('/form/submit', {
      method: 'POST',
      body: new URLSearchParams(invalidData)
    })

    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain('❌ 入力エラー')
    expect(html).toContain('年齢は120以下で入力してください')
  })

  it('should reject empty required fields', async () => {
    const app = new Hono()
    app.route('/', formRouter)

    const invalidData = {
      name: '',
      email: '',
      age: '',
      message: ''
    }

    const res = await app.request('/form/submit', {
      method: 'POST',
      body: new URLSearchParams(invalidData)
    })

    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain('❌ 入力エラー')
    expect(html).toContain('名前は必須です')
    expect(html).toContain('メールアドレスは必須です')
    expect(html).toContain('メッセージは必須です')
  })

  it('should reject invalid name characters', async () => {
    const app = new Hono()
    app.route('/', formRouter)

    const invalidData = {
      name: '田中太郎<script>alert("xss")</script>',
      email: 'tanaka@example.com',
      age: '25',
      message: 'テストメッセージです'
    }

    const res = await app.request('/form/submit', {
      method: 'POST',
      body: new URLSearchParams(invalidData)
    })

    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain('❌ 入力エラー')
    expect(html).toContain('名前は英数字、ひらがな、カタカナ、漢字のみ使用できます')
  })

  it('should reject message that is too long', async () => {
    const app = new Hono()
    app.route('/', formRouter)

    const longMessage = 'a'.repeat(501) // 501文字
    const invalidData = {
      name: '田中太郎',
      email: 'tanaka@example.com',
      age: '25',
      message: longMessage
    }

    const res = await app.request('/form/submit', {
      method: 'POST',
      body: new URLSearchParams(invalidData)
    })

    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain('❌ 入力エラー')
    expect(html).toContain('メッセージは500文字以内で入力してください')
  })

  it('should display logs endpoint', async () => {
    const app = new Hono()
    app.route('/', formRouter)

    const res = await app.request('/form/logs')
    const html = await res.text()

    expect(res.status).toBe(200)
    expect(html).toContain('log-entry')
  })

  it('should handle negative age', async () => {
    const app = new Hono()
    app.route('/', formRouter)

    const invalidData = {
      name: '田中太郎',
      email: 'tanaka@example.com',
      age: '-5',
      message: 'テストメッセージです'
    }

    const res = await app.request('/form/submit', {
      method: 'POST',
      body: new URLSearchParams(invalidData)
    })

    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain('❌ 入力エラー')
    expect(html).toContain('年齢は0以上で入力してください')
  })

  it('should handle non-integer age', async () => {
    const app = new Hono()
    app.route('/', formRouter)

    const invalidData = {
      name: '田中太郎',
      email: 'tanaka@example.com',
      age: '25.5',
      message: 'テストメッセージです'
    }

    const res = await app.request('/form/submit', {
      method: 'POST',
      body: new URLSearchParams(invalidData)
    })

    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain('❌ 入力エラー')
    expect(html).toContain('年齢は整数で入力してください')
  })

  it('should handle name that is too long', async () => {
    const app = new Hono()
    app.route('/', formRouter)

    const longName = 'a'.repeat(51) // 51文字
    const invalidData = {
      name: longName,
      email: 'tanaka@example.com',
      age: '25',
      message: 'テストメッセージです'
    }

    const res = await app.request('/form/submit', {
      method: 'POST',
      body: new URLSearchParams(invalidData)
    })

    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain('❌ 入力エラー')
    expect(html).toContain('名前は50文字以内で入力してください')
  })
})
