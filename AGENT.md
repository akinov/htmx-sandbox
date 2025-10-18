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

# TypeScript型チェック
bun run typecheck
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

### テストファイル構造
```
src/
├── app.test.ts
└── routes/
    ├── index/
    │   ├── index.ts
    │   └── index.test.ts
    └── clicked/
        ├── index.ts
        └── clicked.test.ts

e2e/
└── app.spec.ts
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

### コミット粒度のガイドライン

- **論理的単位**: 各コミットは単一の完全な論理的変更を表現
- **関心事の分離**: 異なる種類の変更を混在させない（例：機能 + ドキュメント）
- **論理的分組**: 一貫した単位を形成する関連変更をグループ化
- **テスト可能な単位**: 各コミットは独立してテスト・レビュー可能

### 段階的コミット手順

1. **論理単位の特定**: 変更を論理的で原子的な単位に分解
2. **関連ファイルのステージング**: 同じ論理的変更に属するファイルを`git add`でステージング
3. **説明的メッセージの記述**: 明確な説明でConventional Commits形式を使用
4. **コミット前のレビュー**: コミットが完全でテスト可能な変更を表現していることを確認
5. **次の単位への移行**: 次の論理単位に移動してプロセスを繰り返し

## コードスタイル

- TypeScriptでサーバーコードを記述
- ワイルドカードインポートよりも明示的なインポートを優先
- 意味のある変数名と関数名を使用
- ファイル操作にはエラーハンドリングを追加

## CI/CD

### GitHub Actions
- **トリガー**: プルリクエストとmainブランチへのpush
- **実行内容**:
  - TypeScript型チェック (`bun run typecheck`)
  - ユニットテスト (`bun run test`)
  - E2Eテスト (`bun run test:e2e`)
- **環境**: Ubuntu latest + Bun latest
- **キャッシュ**: 依存関係をキャッシュして高速化
- **アーティファクト**: Playwrightテストレポートを30日間保存

## プロジェクト構造ルール

- Bunランタイムを使用
- サーバーコードは`src/`ディレクトリに配置
- 静的ファイルは`public/`ディレクトリに配置
- Honoフレームワークの規約に従う
