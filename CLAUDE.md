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
- 翻訳ファイル: `packages/ui/src/i18n/locales/ja.json`
- 言語切替: 設定画面 > Appearance > Language

### フォーク元（upstream）更新への追従手順
1. `git remote add upstream https://github.com/btriapitsyn/openchamber.git`（初回のみ）
2. `git fetch upstream`
3. `git merge upstream/main`
4. コンフリクト解消（`t()` ラップの差分なので容易）
5. `bun scripts/find-untranslated.ts` で未翻訳の新規文字列を検出
6. `packages/ui/src/i18n/locales/ja.json` に新規翻訳を追加

### 新しい文字列の翻訳方法
1. コンポーネントに `import { useTranslation } from 'react-i18next';` を追加
2. `const { t } = useTranslation();` をコンポーネント内に追加
3. 文字列を `t('English text')` でラップ
4. `ja.json` と `en.json` の両方にエントリを追加
