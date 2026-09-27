# iKnoWay — Personal Site

アニメと映画を愛するオタク、iKnoWay の個人サイト。
初回は19テーマからランダムに選ばれ、以後は選んだ表情を保存します。ページ内の切替ボタンで別テーマを引けます。

---

## テーマ一覧

| テーマ | コンセプト | 主な技術的特徴 |
|---|---|---|
| **classy** | スターバックス風 — ダークグリーンの壁・木目・黒板・暖かい光 | CSS グラデーションライト演出 / 木目テクスチャ / Caveat フォント黒板 |
| **cyber** | サイバーパンク — 漆黒 × ネオン × グリッチ | Canvas パーティクル / グリッチ CSS アニメ / CRT スキャンライン |
| **anime** | 明るいマンガ・アニメ風 — 桜ピンク × 空色 × きらきら | きらきら演出 / アニメ調カード / 日本語向け丸ゴシック |
| **y2k** | 2000年代個人サイト風 — GeoCities / Y2K | タイル背景 / レトロ装飾 / 派手な色 |
| **terminal** | ターミナル / CLI 風 | 等幅フォント / コマンド表示 / 端末UI |
| **magazine** | 雑誌・エディトリアル風 | 大きな文字組み / 紙面風レイアウト |
| **kawaii** | かわいいポップUI | パステル / 丸み / 軽い装飾 |
| **brutalist** | ブルータリズムWeb風 | 強い罫線 / ラフな構成 / 高コントラスト |
| **vaporwave** | Vaporwave / レトロフューチャー | ネオン / グリッド / 80s風カラー |
| **zen** | 静かな和・ミニマル | 余白 / 落ち着いた配色 / 控えめな動き |
| **space** | 宇宙・SF風 | 星・奥行き / ダーク背景 |
| **newspaper** | 新聞・活字風 | 紙面レイアウト / セリフ体 / 罫線 |
| **apple** | Apple風プロダクトページ | 余白 / 大きなタイポグラフィ / 滑らかなセクション |
| **fantasy-book** | ファンタジー本・章立てUI | 本のページ構造 / 章ナビゲーション |
| **winxp** | Windows XP / Luna 風 | XP風タスクバー / ウィンドウクローム / デスクトップアイコン |
| **data-js** | `shared/data.js` をそのまま見せるソース表示テーマ | Fetch API / 行番号付きコードビュー |
| **ukiyo-e** | 浮世絵・藍染風 — 和紙、藍、朱、金 | 和紙の粒子 / 印章 / 版画風の重なり |
| **gothic** | ゴシック・ノクターン — 深夜の書庫と蝋燭 | 月光の演出 / Cinzel活字 / 深紅の差し色 |
| **handheld** | レトロ携帯ゲーム機 — 緑液晶のポケットアーカイブ | LCD画面 / ピクセル書体 / ゲーム機クローム |

---

## ディレクトリ構成

```
/docs                    GitHub Pages 公開 & 開発ディレクトリ
├─ index.html            エントリーポイント（ローダー + テーマ選択）
├─ theme-router.js       テーマ選択ロジック
│
├─ themes/
│   └─ <theme>/          各テーマ（index.html / style.css / script.js）
│
└─ shared/
    ├─ data.js           全テーマ共通コンテンツデータ
    ├─ games.js          ゲームセクションの共通描画
    ├─ projects.js       成果物セクションの共通描画
    ├─ snap.js           スクロール補助
    ├─ human-polish.css  ヘッダー・共通ボタン寸法の共通レイヤー
    └─ utils.js          全テーマ共通ユーティリティ関数

/ai-docs                 AI / 開発者向けの設計・運用ドキュメント
/sops                    再利用する作業手順
/scripts                 補助スクリプト
/.claude                 Claude Code 用設定・コマンド
/.github                 GitHub Actions
```

---

## コンテンツの仕組み

プロフィール・ゲーム・お気に入りアニメ・お気に入り映画・成果物・連絡先などのコンテンツは
`shared/data.js` に一元管理されています。各テーマは同じデータを読み取り、
テーマ固有のデザインで描画します。

**コンテンツを変更したいときは `shared/data.js` を編集するだけでOK。**

---

## テーマ切替の仕組み

サイトは `localStorage` を使って選んだテーマを次回訪問時も表示します。
ページ内のテーマ切替ボタンを押すと、現在とは別のテーマを選んで保存します。ヘッダーの「自動 ON」を有効にすると、次回の再読み込み時に現在とは別のテーマを自動で引きます。

| URL | 動作 |
|---|---|
| `docs/index.html` | ランダムでテーマを選択・表示 |
| `docs/index.html?switch=1` | 現在と**異なる**テーマに強制切替 |
| `docs/index.html?theme=classy` | `classy` テーマを固定表示（開発用） |
| `docs/index.html?theme=anime` | `anime` テーマを固定表示（開発用） |
| `docs/index.html?theme=winxp` | `winxp` テーマを固定表示（開発用） |
| `docs/index.html?theme=data-js` | `data-js` テーマを固定表示（開発用） |

各ページ内の「Switch Theme / GACHA」ボタンは `?switch=1` を使っています。
「自動 ON / OFF」は端末内に保存され、ON の間はブラウザの再読み込みでもテーマを引き直します。

---

## 使用技術

- **HTML / CSS / JavaScript**（バンドラー・フレームワーク不使用）
- Google Fonts — Playfair Display / Lato / Caveat / Bebas Neue / Rajdhani / Noto Sans JP
- Canvas API（anime テーマのパーティクル）
- IntersectionObserver API（スクロールアニメーション）
- GitHub Pages（`main` ブランチの `/docs` を公開）
- AI docs 構成チェック（`scripts/ai-docs-check.sh` / GitHub Actions / Claude Code SessionStart）

外部ライブラリへの依存は **ゼロ** です。

---

## セットアップ・デプロイ

ビルドステップは不要です。`/docs` ディレクトリをそのまま静的ホスティングに配置するだけで動作します。

### ローカルで確認する

`file://` 直開きだと Canvas などが制限される場合があるため、簡易サーバーを使うことを推奨します。

```bash
# Python がある場合
cd docs && python3 -m http.server 8080

# Node.js がある場合
npx serve docs
```

その後 `http://localhost:8080` にアクセス。

### GitHub Pages（現在の設定）

- **公開ディレクトリ**: `/docs`（Branch `main` / Folder `/docs`）
- **公開 URL**: `https://iknoway-home.github.io/my-website/`

`docs/` を編集してプッシュすればそのまま反映されます。同期作業は不要です。

---

## AI / 開発者向けドキュメント

このリポジトリでは、AI エージェントや開発者が迷わず作業できるように、内部向けドキュメントをサイト本体とは分けて管理します。

| パス | 役割 |
|---|---|
| `AGENTS.md` | AI / 開発者向けの共通作業ルール |
| `CLAUDE.md` / `GEMINI.md` / `QWEN.md` | 各AIツール用入口（`AGENTS.md` へのシンボリックリンク） |
| `DESIGN.md` | UI / UX / テーマ実装方針 |
| `ai-docs/` | プロジェクト概要、機能マップ、設計、運用、テスト、セキュリティ |
| `.agents/skills/` | 再利用する作業手順（SKILL.md） |
| `.claude/commands/update-ai-docs.md` | Claude Code の `/update-ai-docs` 用コマンド |
| `scripts/ai-docs-check.sh` | AI docs の鮮度チェック |

---

## テーマを追加したい場合

1. `docs/themes/` に新ディレクトリを作成し `index.html` / `style.css` / `script.js` を実装
2. `script.js` 内で `window.__data` を読み取ってコンテンツを描画する
3. `docs/theme-router.js` の `THEMES` 配列にエントリを追加
4. `README.md` と `ai-docs/CODEMAP.md` を更新

新規テーマのヘッダーは `site-header` / `nav-inner` / `nav-logo` / `nav-links` / `nav-switch` を使い、`style.css` の後に `../../shared/human-polish.css` を読み込んでください。
ヘッダーと共通ボタンの位置・サイズは `human-polish.css` の `--chrome-*` で全テーマ共通管理します。
通常テーマでは `../../shared/data.js` の後に `../../shared/games.js` と `../../shared/projects.js` も読み込んでください。ゲーム一覧はAnime直前、成果物一覧はContactとは別セクションとして自動挿入されます。

```js
const THEMES = [
  { id: 'classy',       path: 'themes/classy/index.html',       weight: 1 },
  { id: 'future-theme', path: 'themes/future-theme/index.html', weight: 1 }, // <- 追加
];
```

`weight` の値で出現確率を調整できます。

---

## カスタマイズ

コンテンツの変更は `docs/shared/data.js` のみで行えます。

- プロフィール情報（名前・役割・自己紹介・特徴）
- お気に入りアニメ一覧（タイトル・コメント・タグ）
- お気に入り映画一覧（タイトル・コメント・タグ）
- 連絡先（メールアドレス・メッセージ）
- SNS リンク（GitHub / Twitter など）

---

## ライセンス

このリポジトリのコードは [MIT License](LICENSE) のもとで公開しています。
