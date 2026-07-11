# Astro 移行 現状確認と残作業計画(2026-07-12)

Claude Code による現状調査の記録。以後の作業計画・調査記録はこの `docs/` ディレクトリに
`YYYY-MM-DD-<topic>.md` の形式で残す。

## 現状サマリ

移行は**ほぼ完成**している。`npm run build` は成功し、旧サイトの全セクション
(Hero / Biography / Works / Softwares / Licenses / Publications)が
Astro コンポーネント + Content Collections + i18n(EN/JA 切替)で再現されている。

- ローカル `master` はリモートより **11 コミット先行**(Astro 移行の全作業)。
- リモート `origin/master` は**旧 HTML サイトのまま**。本番
  https://hidekia.github.io は現在も旧サイトを配信中(正常動作)。
- i18n 関連の重要ファイル群が**未コミット**(untracked)のまま:
  `src/content.config.ts`, `src/components/{En,Ja,T}.astro`,
  `src/content/{biography,licenses,software}.yaml`,
  `src/content/works/`, `src/content/softwares/`, バッジ画像 2 枚。
  これらが無いとビルドできないため、コミット漏れの状態。

## 残作業計画(優先度順)

### 1. デプロイ基盤の整備【最重要・未着手】
`.github/workflows/` が存在しない。GitHub Pages は現在「ブランチから配信」設定のため、
このまま Astro ソースを push すると**本番サイトが壊れる**。

1. `withastro/action` を使う GitHub Actions ワークフロー
   (`.github/workflows/deploy.yml`)を追加する。
2. GitHub リポジトリ設定 → Pages → Source を **GitHub Actions** に変更する
   (これは GitHub の Web UI での手動操作)。
3. 上記 1→2 の順で準備してから push する。push は必ずユーザー自身が行う
   (CLAUDE.md の指示により Claude は git push しない)。

### 2. 未コミットファイルのコミット
untracked のソース一式(上記)と CLAUDE.md の変更をコミットして
作業内容を確定させる。

### 3. 不要ファイルの整理
- `src/content/software.yaml` — どこからも参照されていない
  (「Single Yaml」方式の名残。`src/content/softwares/*.mdx` に移行済み)。削除する。
- `_old_site/` — .gitignore 済み。本番切替と表示確認が完了したら削除してよい
  (それまでは比較用に残す)。

### 4. 小さな修正
- `package.json` の `name: "astro-temp"` をプロジェクト名に変更。
- `src/components/Publications.astro` の空アンカー
  (`<a href="...scholar...">` 中身なし、22 行目付近)を削除。
- `Works.astro` のロゴ・ストアリンク画像に `alt` 属性を付与(アクセシビリティ)。

### 5. 運用メモ(任意)
- Google Scholar の被引用数(`Publications.astro` 内にハードコード)と
  `src/content/publications.json` は手動更新。更新手順をどこかに残すとよい。

## プレビュー方法

- 開発サーバー: `npm run dev` → http://localhost:4321 (ファイル編集が即時反映)
- 本番相当の確認: `npm run build && npm run preview` → http://localhost:4321

依存関係はインストール済み(node_modules あり、Node v24 で動作確認済み)。

## 確認済み事項(証跡)

- `npm run build`: 成功(2026-07-12、Astro 6.1.x / Node 24.13.1)
- 本番サイト: 旧サイトが正常配信中(WebFetch で確認)
- 新ビルドのセクション構成: top / biography / works / softwares / licenses /
  publications — 旧サイトと同一
- 新サイトのコンテンツは旧サイトより新しい(例: 被引用数 4,564 vs 旧 4,441)
