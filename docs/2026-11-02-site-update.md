# サイト内容の更新と依存関係の更新（2026-11-02）

Claude Code による作業記録。前回の状況は `docs/2026-07-12-migration-status.md` を参照。

## 実施内容

### 1. コンテンツ修正（依頼事項）

1. **職歴（日本語）**: 年号の `present` を「現在」で表示（`2022-現在`, `2024-現在`）。
   `biography` コレクションの `period` を「文字列（両言語共通）」または `{ en, ja }` の
   どちらでも書けるようにした（`src/content.config.ts`、Biography.astro は `<T>` で出し分け）。
2. **学歴（日本語）**: 博士課程の「博士（工学）」を改行せず半角スペース区切りで表示。
3. **Works「光ID」→「New LinkRay」**（`src/content/works/light-id.mdx`）
   - タイトル: 英語 `New LinkRay` / 日本語 `光ID / New LinkRay`
   - 旧バージョンのアプリ画面 `public/img/AppStore_HikariID.png` を削除。
   - アイコン 4 枚を横 1 列（画面幅 640px 以下は 2 列 × 2 行）で表示し、各画像から
     言語別のページへリンク。works スキーマに `icons`（`src` / `alt{en,ja}` / `link{en,ja}`）を追加。

     | 画像 | 日本語版リンク | 英語版リンク |
     |------|---------------|-------------|
     | `HikariID_icon.png` | App Store (JP) 光ID | App Store (US) LinkRay - Hikari ID |
     | `AsahikawaWF2025_icon.png` | App Store (JP) 旭川冬まつり 2025 with 光ID | App Store (US) Asahikawa Winter Festival 2025 |
     | `LinkRayScanner_icon.png` | Google Play (`hl=ja`) | Google Play (`hl=en`) |
     | `PieceFuture_logo.png` | Piece Future 日本語プレスリリース | Piece Future 英語プレスリリース |

   - 画像の取得元: App Store は iTunes Lookup API の `artworkUrl512`、Google Play は
     ストアページの `og:image`、Piece Future はサイトヘッダーのロゴ（PF Logo 2025）。
     ロゴは余白を除去して 512×512 の透過 PNG に収めた。角丸・枠線は CSS で付与している。
4. **Google Scholar**: 被引用数を 4,628 に更新、キーワードに `VLA` を追加。

### 2. 依存関係・ビルド環境

- Astro `^6.1.3` → `^7.4.4`、`@astrojs/mdx` `^5.0.3` → `^8.1.2`（同日中に 2 段階で更新）。
  - Astro 7.4.2 以降は **Node.js ≥ 22.23.4 を要求**
    （2026 年 10 月の Node.js セキュリティリリース対応のため最低版を引き上げ）。
    当初ローカルの Node は v22.23.2 で `astro` CLI が起動を拒否した
    （`Node.js v22.23.2 is not supported by Astro!`）ため、いったん 7.4.1 / 8.1.0 に固定。
  - その後ユーザーが `nvm install 22` で v22.23.4 を導入したので最新版に更新した。
  - 注意: ユーザーが `npm install astro@latest @astrojs/mdx@latest` をホームディレクトリ
    （`~`）で実行してしまい、`~/package.json` `~/package-lock.json` `~/node_modules`（約 159MB）
    が残っている。プロジェクトには影響しないので削除してよい。
- `package.json` の `engines.node` を `>=22.23.4` に更新。
- Claude Code の Bash シェルでは oh-my-zsh の nvm 遅延ロードが壊れており `node` が v22.23.2 に
  解決される。プロジェクトの npm コマンドは
  `export PATH="$HOME/.nvm/versions/node/v22.23.4/bin:$PATH"` を前置して実行する。
- GitHub Actions（`.github/workflows/deploy.yml`）:
  `actions/checkout` v4 → v7、`withastro/action` v3 → v6（Node 24 でビルド）、
  `actions/deploy-pages` v4 → v5。

### 3. Astro 7 の破壊的変更への対応

- **`compressHTML` の既定値が `true` → `'jsx'`** に変更。改行をはさんで式が並ぶ箇所の
  空白が削除される（JSX と同じ規則）。旧設定でのビルド出力と差分比較した結果、
  Publications の「論文タイトル,” 会議名」の間の空白が消えていたため 1 行に書き換えて修正。
  他の差分（ナビ、言語トグル、画像リンク等）はすべて flex / block 要素内のため表示に影響なし。
- コンパイラが Rust 製に置き換え（閉じタグ漏れがエラーになる）→ 問題なし。
- Markdown プロセッサが Sätteri に変更 → remark/rehype プラグイン未使用のため影響なし。
- MDX 本文の改行: 旧サイトでは `<br>` で 3 行表示していた箇所（IEC / IEEE の役職）が
  1 行に連結されていたため、`.work-body p` に `white-space: pre-line` を追加して
  MDX の改行をそのまま改行として表示するようにした（Biography と同じ方式）。

### 4. 追加のコンテンツ修正（同日 2 回目の依頼）

1. 職歴（日本語）「工学研究科　特命講師」、学歴（日本語）「修了　博士（工学）」の区切りを全角スペースに。
2. 年号のハイフン前後に半角スペース（`2011 - 2022`、`2022 - present` / `2022 - 現在` など、両言語）。
   折り返し防止のため `.period` に `white-space: nowrap` を追加。
3. Works の先頭に「Physical AI / Humanoid Robot」（本文 `To be announced`）を追加
   （`src/content/works/physical-ai.mdx`）。`order` を 1〜6 に振り直した。
4. Works の IEC と LinkRay の本文を日本語でも英語表記に統一（`<En>`/`<Ja>` ブロックを廃止）。
   IEEE の本文は依頼対象外のため日本語のまま。
5. 「Free Softwares」→「Softwares」。画像列を廃止してタイトルと説明文だけのコンパクトな表示に。
   `software` コレクションの `image` 系フィールドと各 MDX のフロントマターも削除。
   `public/software/browser_switch/BrowserSwitch.png` は配布ページで使用中のため残す。

### 5. 追加のコンテンツ修正（同日 3 回目の依頼）

1. Works「New LinkRay」の表記を英語 `LinkRay (2nd Gen.)` / 日本語 `光ID / LinkRay (第2世代)` に変更。
2. Works IEEE の日本語本文を「IEEE 802 標準化委員会 / Task Group 15.7 副議長」に変更。
3. Softwares の本文を日本語でも英語表記に統一（`<En>`/`<Ja>` ブロックを廃止）。
4. Certificates「IT (IPA)」の 3 件を取得年の古い順（第二種情報処理技術者 → ソフトウェア開発技術者 →
   ネットワークスペシャリスト）に並べ替え、英語名から `Examination` を削除。

### 6. 小修正

- Hero のメールアドレス画像に `alt=""`（画像化して収集を避ける意図のため空）。
- README の `git clone` URL が Markdown リンク形式で壊れていたのを修正。
- Works: 画像・動画のない項目で空の `.media-grid` を出力しないように変更。
  iframe の非推奨属性 `frameborder` を CSS（`border: 0`）に置き換え。

## 確認済み事項（証跡）

- `npm run build` 成功（Astro 7.4.4 / MDX 8.1.2 / Node v22.23.4）。
- 生成 HTML で以下を確認: `2022 - 現在` `2024 - 現在` の出し分け、博士課程の 1 行表示、
  Publications の空白復元、`icon-grid`（言語別 href / alt）、`Cited by: 4,628`、`VLM / VLA`、
  Works 先頭の Physical AI 項目、IEC / LinkRay の英語表記統一、Softwares の画像なし表示。
- headless Firefox でデスクトップ幅（1280px）・モバイル幅（400px）× EN / JA の表示を確認。

## 現在の状態と次の手順

- GitHub Pages の Source は **GitHub Actions に切替済み**（API で `build_type: workflow` を確認）。
- `origin/master` は旧 HTML サイトのまま（本番も旧サイトを配信中）。
  ローカル `master` は 20 コミット先行 ＋ 今回の未コミット変更。
- 今回の変更をコミットして push すればワークフローがビルド・デプロイする（push はユーザーが行う）。
- 本番切替後、`_old_site/`（.gitignore 済み）は削除してよい。

## 運用メモ

- Google Scholar の被引用数: `src/components/Publications.astro` の `Cited by:` を手動更新。
- 論文の追加: `src/content/publications.json` の先頭に追加。
- Works のアイコン追加: `src/content/works/*.mdx` の `icons` に
  `src` / `alt: {en, ja}` / `link: {en, ja}` を追記（`ja` 省略時は `en` を使用）。
