# @openchamber/gas

OpenChamber の Google Apps Script 連携パッケージ。  
TypeScript で GAS を開発し、esbuild でバンドルして clasp でデプロイします。

---

## 前提条件

- Node.js 20+, Bun 1.3.5
- Google アカウント
- Apps Script API を有効化: https://script.google.com/home/usersettings

## 初回セットアップ

```bash
# 1. 依存関係のインストール（ルートで実行）
bun install

# 2. Googleアカウントでログイン
bun run --cwd packages/gas clasp:login

# 3a. 新規GASプロジェクト作成
bun run --cwd packages/gas clasp:create
# → 生成された .clasp.json を確認

# 3b. 既存プロジェクトに接続する場合
cp packages/gas/.clasp.json.example packages/gas/.clasp.json
# .clasp.json の scriptId を書き換える
```

## 日常ワークフロー

| コマンド | 説明 |
|---|---|
| `bun gas:dev` | esbuild watch + clasp watch（自動同期） |
| `bun gas:build` | ビルドのみ（dist/ に出力） |
| `bun gas:push` | ビルドして GAS へアップロード |
| `bun gas:pull` | GAS からローカルへダウンロード |
| `bun gas:deploy` | バージョンデプロイ |
| `bun gas:open` | Apps Script エディタをブラウザで開く |
| `bun gas:logs` | Cloud Logging のログを表示 |

## ディレクトリ構成

```
packages/gas/
├── src/
│   ├── Main.ts              # エントリポイント（onOpen, doGet など）
│   ├── services/            # サービス層
│   └── utils/               # 共通ユーティリティ
├── dist/                    # ビルド出力（gitignore済み、clasp pushの対象）
├── build.mjs                # esbuild ドライバー
├── appsscript.json          # GAS マニフェスト
├── .clasp.json.example      # clasp 設定テンプレート
└── tsconfig.json            # TypeScript 設定
```

## ビルドの仕組み

`src/Main.ts` からエントリーし、全 import を単一の `dist/Code.js` にバンドル。  
IIFE 形式で出力し、フッターで named export を GAS グローバルスコープに公開します。

```
src/Main.ts
  └─ import services/SheetsService.ts
  └─ import utils/logger.ts
       ↓ esbuild bundle
dist/Code.js  ← clasp push でアップロード
dist/appsscript.json
```

## 注意事項

- GAS は ES モジュール非対応のため、`import/export` は esbuild がバンドル時に解決
- 動的 `import()` は使用不可
- Node.js 組み込みモジュール（`fs`, `path` など）は使用不可
- トリガー関数は必ず `export function` で定義すること（グローバルスコープへの公開のため）
- OAuth スコープの変更は `appsscript.json` を編集後に push が必要
