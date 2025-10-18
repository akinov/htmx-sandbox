import { Hono } from 'hono'
import { z } from 'zod'

const formRouter = new Hono()

// 入力データのスキーマ定義
const FormDataSchema = z.object({
  name: z.string()
    .min(1, '名前は必須です')
    .max(50, '名前は50文字以内で入力してください')
    .regex(/^[a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s]+$/, { message: '名前は英数字、ひらがな、カタカナ、漢字のみ使用できます' }),

  email: z.string()
    .min(1, 'メールアドレスは必須です')
    .email('正しいメールアドレスを入力してください'),

  age: z.coerce.number()
    .int('年齢は整数で入力してください')
    .min(0, '年齢は0以上で入力してください')
    .max(120, '年齢は120以下で入力してください'),

  message: z.string()
    .min(1, 'メッセージは必須です')
    .max(500, 'メッセージは500文字以内で入力してください')
})

// フォーム表示
formRouter.get('/form', (c) => {
  return c.html(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>入力フォーム - HTMX Sandbox</title>
    <script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.6/dist/htmx.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background-color: #45a049; }
        .error { color: red; font-size: 14px; margin-top: 5px; }
        .success { color: green; font-size: 14px; margin-top: 5px; }
        .log-section { margin-top: 30px; padding: 15px; background-color: #f5f5f5; border-radius: 4px; }
        .log-entry { margin-bottom: 10px; padding: 8px; background-color: white; border-left: 3px solid #4CAF50; }
    </style>
</head>
<body>
    <h1>入力検証テストフォーム</h1>

    <form hx-post="/form/submit" hx-target="#result" hx-swap="innerHTML">
        <div class="form-group">
            <label for="name">名前 *</label>
            <input type="text" id="name" name="name" required>
        </div>

        <div class="form-group">
            <label for="email">メールアドレス *</label>
            <input type="email" id="email" name="email" required>
        </div>

        <div class="form-group">
            <label for="age">年齢 *</label>
            <input type="number" id="age" name="age" min="0" max="120" required>
        </div>

        <div class="form-group">
            <label for="message">メッセージ *</label>
            <textarea id="message" name="message" rows="4" required></textarea>
        </div>

        <button type="submit">送信</button>
    </form>

    <div id="result"></div>

    <div class="log-section">
        <h3>送信ログ</h3>
        <div id="logs" hx-get="/form/logs" hx-trigger="load, every 2s" hx-swap="innerHTML">
            <p>ログを読み込み中...</p>
        </div>
    </div>
</body>
</html>
  `)
})

// フォーム送信処理（入力検証付き）
formRouter.post('/form/submit', async (c) => {
  try {
    // フォームデータの取得
    const formData = await c.req.parseBody()

    // Zodスキーマで検証
    const validatedData = FormDataSchema.parse(formData)

    // ログ出力
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: 'form_submit',
      data: validatedData,
      status: 'success'
    }

    console.log('✅ フォーム送信成功:', logEntry)

    // 成功レスポンス
    return c.html(`
      <div class="success">
        <h3>✅ 送信成功！</h3>
        <p><strong>名前:</strong> ${validatedData.name}</p>
        <p><strong>メール:</strong> ${validatedData.email}</p>
        <p><strong>年齢:</strong> ${validatedData.age}歳</p>
        <p><strong>メッセージ:</strong> ${validatedData.message}</p>
        <p><em>データは正常に検証され、ログに記録されました。</em></p>
      </div>
    `)

  } catch (error) {
    // バリデーションエラーの処理
    if (error instanceof z.ZodError) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        action: 'form_submit',
        data: await c.req.parseBody(),
        status: 'validation_error',
        errors: error.issues
      }

      console.log('❌ バリデーションエラー:', logEntry)

      // エラーメッセージの生成
      const errorMessages = error.issues.map(err =>
        `<li><strong>${err.path.join('.')}:</strong> ${err.message}</li>`
      ).join('')

      return c.html(`
        <div class="error">
          <h3>❌ 入力エラー</h3>
          <ul>${errorMessages}</ul>
          <p><em>入力内容を確認して再度送信してください。</em></p>
        </div>
      `)
    }

    // その他のエラー
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: 'form_submit',
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    }

    console.log('💥 システムエラー:', logEntry)

    return c.html(`
      <div class="error">
        <h3>💥 システムエラー</h3>
        <p>申し訳ございません。システムエラーが発生しました。</p>
        <p><em>しばらく時間をおいて再度お試しください。</em></p>
      </div>
    `)
  }
})

// ログ表示用エンドポイント
formRouter.get('/form/logs', (c) => {
  // 実際のアプリケーションでは、データベースやログファイルから取得
  // ここでは簡易的にコンソールログの代わりにサンプルログを返す
  const sampleLogs = [
    {
      timestamp: new Date(Date.now() - 30000).toISOString(),
      action: 'form_submit',
      status: 'success',
      message: 'テストデータが正常に送信されました'
    },
    {
      timestamp: new Date(Date.now() - 60000).toISOString(),
      action: 'form_submit',
      status: 'validation_error',
      message: 'メールアドレスの形式が正しくありませんでした'
    }
  ]

  const logHtml = sampleLogs.map(log => `
    <div class="log-entry">
      <strong>${new Date(log.timestamp).toLocaleString()}</strong> -
      ${log.action} -
      <span style="color: ${log.status === 'success' ? 'green' : 'red'}">${log.status}</span>
      <br><small>${log.message}</small>
    </div>
  `).join('')

  return c.html(logHtml || '<p>ログがありません</p>')
})

export default formRouter
