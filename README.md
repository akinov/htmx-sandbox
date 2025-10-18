# HTMX Sandbox Project

## プロジェクト概要

このプロジェクトは、HTMXとHonoフレームワークを使用したWebアプリケーションのサンドボックス環境です。リアルタイムなユーザーインタラクションをHTMXで実装し、軽量なサーバーサイドフレームワークであるHonoでバックエンドを構築しています。

## 技術スタック

- **Runtime**: Bun
- **Backend Framework**: Hono
- **Frontend**: HTMX
- **Language**: TypeScript

## プロジェクト構造

```
src/
├── index.ts                 # エントリーポイント（サーバー起動）
├── app.ts                   # Honoアプリインスタンスとルート登録
├── app.test.ts              # アプリ全体のテスト
└── routes/
    ├── index/
    │   ├── index.ts         # / (ルート) のハンドラー
    │   └── index.test.ts    # ルートハンドラーのテスト
    └── clicked/
        ├── index.ts         # /clicked のハンドラー
        └── index.test.ts    # クリックハンドラーのテスト

e2e/
└── app.spec.ts              # E2Eテスト
```

## 開発コマンド

```bash
# 開発サーバー起動（ホットリロード付き）
bun run dev

# 本番サーバー起動
bun run start

# ユニットテスト実行
bun run test

# E2Eテスト実行
bun run test:e2e

# 全テスト実行
bun run test:all
```

## テスト戦略

### ユニットテスト（Vitest）
- 各ルートハンドラーの単体テスト
- HTMLレスポンスの内容確認
- HTMX属性の検証

### E2Eテスト（Playwright）
- ブラウザでの実際の動作確認
- HTMXの動的更新の検証
- ユーザーインタラクションのテスト

## セットアップ

1. 依存関係のインストール
```bash
bun install
```

2. 開発サーバーの起動
```bash
bun run dev
```

3. ブラウザで `http://localhost:3000` にアクセス
