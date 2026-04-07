# CLAUDE.md

## Agent Model Selection Policy

エージェント呼び出し時は、タスクの内容に応じて最適なモデルを指定すること:

- **haiku**: 単純な探索・検索・ファイル読み取りなど軽量タスク（Explore subagent）
- **sonnet**: 中程度の複雑さのタスク、コード分析、実装作業（general-purpose subagent）
- **opus**: 複雑な設計・アーキテクチャ判断・計画策定（Plan subagent）

## i18n / 日本語対応

### アーキテクチャ
- `i18next` + `react-i18next` を使用
- 英語文字列そのものをキーとして使用（`t('English text')` 形式）
- 翻訳ファイル:
  - `packages/ui/src/i18n/locales/en.json` — identity map（キー＝値）
  - `packages/ui/src/i18n/locales/ja.json` — 日本語翻訳
- 現在のキー数: **1,791キー**（en.json / ja.json 完全一致）
- 言語切替: 設定画面 > Appearance > Language
- 言語設定は localStorage の `'openchamber-language'` キーに保存
- 初期化: `packages/ui/src/i18n/index.ts`
- 言語切替フック: `packages/ui/src/i18n/useLanguage.ts`

### i18nextの設定
- `keySeparator: false` — 英語文のドット記法解析を防止
- `fallbackLng: 'en'` — 未翻訳の新規文字列は自動的に英語で表示
- `escapeValue: false` — React が XSS を処理するため不要

### 翻訳パターン

#### 基本
```tsx
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
// JSX内: {t('English text')}
// 属性: placeholder={t('Search')}
```

#### 補間（変数を含む文字列）
```tsx
// ✅ 正しい: i18next補間パターン
t('Command "{{name}}" deleted successfully', { name })

// ❌ 誤り: 断片結合（日本語の語順が崩れる）
`${t('Command')} "${name}" ${t('deleted successfully')}`
```

#### 定数のオプションラベル
定数定義は変更せず、レンダリング時に `t()` でラップ:
```tsx
const OPTIONS = [{ id: 'dark', label: 'Dark' }];
// レンダリング時:
<span>{t(option.label)}</span>
```

### 翻訳対象外
- ブランド名: OpenChamber, OpenCode, GitHub, Discord, Cloudflare, VS Code
- 技術用語がそのまま通じるもの: Git, MCP, SSH, API, PR, WSL
- CSS クラス, ID, URL, パス, コード
- デバッグパネル (MemoryDebugPanel)

### 未翻訳文字列検出ツール
```bash
bun scripts/find-untranslated.ts          # 一覧表示
bun scripts/find-untranslated.ts --json   # JSON形式
bun scripts/find-untranslated.ts --check  # CI用（未翻訳があると exit 1）
```

### フォーク元（upstream）更新への追従手順
1. `git remote add upstream https://github.com/btriapitsyn/openchamber.git`（初回のみ）
2. `git fetch upstream`
3. `git merge upstream/main`
4. コンフリクト解消（`t()` ラップの差分なので容易）
5. `bun scripts/find-untranslated.ts` で未翻訳の新規文字列を検出
6. `packages/ui/src/i18n/locales/ja.json` に新規翻訳を追加
7. `packages/ui/src/i18n/locales/en.json` にも同じキーを identity map で追加

### 新しい文字列の翻訳方法
1. コンポーネントに `import { useTranslation } from 'react-i18next';` を追加
2. `const { t } = useTranslation();` をコンポーネント内に追加
3. 文字列を `t('English text')` でラップ
4. `ja.json` に日本語翻訳エントリを追加
5. `en.json` にも同じキーで identity map エントリを追加（`"English text": "English text"`）
