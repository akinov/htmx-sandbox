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
└── routes/
    ├── index.ts             # / (ルート) のハンドラー
    └── clicked.ts           # /clicked のハンドラー
```

## 開発コマンド

```bash
# 開発サーバー起動（ホットリロード付き）
bun run dev

# 本番サーバー起動
bun run start
```

## Commit規約

### Conventional Commits形式を使用

- **feat**: 新機能の追加
- **fix**: バグ修正
- **docs**: ドキュメントの更新
- **style**: コードスタイルの変更
- **refactor**: リファクタリング
- **test**: テストの追加・修正
- **chore**: その他の変更（依存関係の更新など）

### コミット例

```
feat: HTMXエンドポイントの追加
fix: 静的ファイル配信の問題を解決
docs: READMEにセットアップ手順を追加
chore: 依存関係を最新版に更新
refactor: 共通HTMLテンプレートを抽出
```

### コミットルール

- Conventional Commits形式を必ず使用
- 必要に応じて日本語でコミットメッセージを作成
- コミットは原子的で単一の変更に集中
- 必要に応じてコミット本文に詳細な説明を含める

## コードスタイル

- TypeScriptでサーバーコードを記述
- ワイルドカードインポートよりも明示的なインポートを優先
- 意味のある変数名と関数名を使用
- ファイル操作にはエラーハンドリングを追加

## プロジェクト構造ルール

- Bunランタイムを使用
- サーバーコードは`src/`ディレクトリに配置
- 静的ファイルは`public/`ディレクトリに配置
- Honoフレームワークの規約に従う
