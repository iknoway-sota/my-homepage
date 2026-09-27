# CODEMAP.md

このファイルは、「この機能はどこにあるか」を素早く見つけるための地図です。
実装ファイルの一覧をすべて書くのではなく、探索の入口になる場所だけを保守します。

## 自動更新ルール

以下が変わった場合は、このファイルを更新してください。

- 新しい主要機能（テーマを含む）を追加した。
- 機能の置き場所、責務、入口ファイルを変えた。
- 重要な共通処理の場所を変えた。
- 既存の説明が実態とずれた。

軽微な関数追加や内部実装の差し替えだけなら更新不要です。

## 探し方

1. まずこのファイルで機能名を探す。
2. 見つからない場合は `rg "<機能名|クラス名|データキー>"` で探す。
3. 新しい主要機能だった場合は、このファイルに入口を追加する。

## 機能マップ

| 機能 / 領域 | 入口 | 関連ファイル | メモ |
|---|---|---|---|
| サイト起動（ローダー） | `docs/index.html` | `docs/theme-router.js` | エントリーポイント。ローダー画面を表示してテーマへ遷移 |
| テーマ選択 / 切替 | `docs/theme-router.js` | `THEMES` 配列、`docs/shared/utils.js` | 重み付きランダム。`?theme=<id>` 固定、`?switch=1` 強制切替。自動ガチャがONなら再読み込み時も別テーマを引く |
| コンテンツデータ | `docs/shared/data.js` | 全テーマの `script.js` | `window.__data`。コンテンツ変更はここだけ |
| 各テーマ | `docs/themes/<name>/index.html` | 同ディレクトリの `style.css` / `script.js` | 19 テーマ。一覧は `docs/theme-router.js` を正とする |
| ゲームセクション挿入 | `docs/shared/games.js` | `data.js` の `games` | 通常テーマで Anime 直前に自動挿入 |
| 成果物セクション挿入 | `docs/shared/projects.js` | `data.js` の `projects` | 通常テーマで Contact 直前に自動挿入 |
| スクロールナビ共通 | `docs/shared/snap.js` | 各テーマ | 右下の1ボタンで次セクションへ進み、最終位置では先頭へ戻る。`projects.js` の後に読み込む |
| 共通ユーティリティ | `docs/shared/utils.js` | 全テーマ | `window.__utils`。テーマ切替の補足、自動ガチャ操作、共通更新日表示も担当 |
| ヘッダー / 共通導線 | `docs/shared/human-polish.css` | `docs/shared/utils.js`, 各テーマの `style.css` | テーマ切替のコントラスト、行き先一覧、ヒーロー高、浮遊操作の位置・寸法を共通化 |
| スタイル / テーマ方針 | `DESIGN.md` | 各テーマの `style.css` | カラーパレット・フォント・演出の詳細 |
| 確認手順 | `ai-docs/TESTING.md` | — | ローカルサーバーでの手動確認 |
| デプロイ | `ai-docs/OPERATIONS.md` | — | GitHub Pages（プッシュ = デプロイ） |
| AI docs 構成チェック | `scripts/ai-docs-check.sh` | `.claude/settings.json`, `.github/workflows/ai-docs-check.yml` | SessionStart フックと PR / 月次 CI から実行 |

## 置き場所の目安

| 種類 | 置き場所 |
|---|---|
| 新テーマ | `docs/themes/<kebab-case-name>/`（`index.html` / `style.css` / `script.js`） |
| テーマ横断の共通処理 | `docs/shared/`（`window.__*` グローバル経由で公開） |
| コンテンツ | `docs/shared/data.js` のみ |
| AI 用ドキュメント | `ai-docs/` |
| 作業手順 | `sops/*.sop.md` |
| 補助スクリプト | `scripts/` |

## ディレクトリの役割

| パス | 役割 | 更新時の注意 |
|---|---|---|
| `docs/` | GitHub Pages 公開ディレクトリ（サイト本体） | AI 用ドキュメントを置かない。プッシュ = 公開 |
| `docs/themes/` | 各テーマ | テーマ追加時は `theme-router.js` と README も更新 |

新規テーマの入口:

- `docs/themes/ukiyo-e/` — 浮世絵・和紙・藍と朱の世界観
- `docs/themes/gothic/` — 深夜の書庫をイメージしたゴシックテーマ
- `docs/themes/handheld/` — 緑液晶のレトロ携帯ゲーム機テーマ
| `docs/shared/` | 全テーマ共通資産 | 読み込み順に注意（`AGENTS.md` 参照） |
| `ai-docs/` | 設計、運用、意思決定 | 古い情報を残さない |
| `.agents/skills/` | 再利用する作業手順（SKILL.md） | 作業が固定化したら追加 |
| `scripts/` | 補助スクリプト | 鮮度チェックの定数はスクリプト先頭 |

## 共通処理

| 処理 | 入口 | 使う側 | 注意 |
|---|---|---|---|
| DOM ヘルパー / モーション設定 | `docs/shared/utils.js`（`window.__utils`） | 全テーマ | `prefersReducedMotion()` を必ず確認 |
| セクション自動挿入 | `docs/shared/games.js` / `projects.js` | 通常テーマ | 特殊構造テーマ（fantasy-book 等）は自前描画 |

## 外部連携

| サービス | 入口 | 設定 | 注意 |
|---|---|---|---|
| GitHub Pages | リポジトリ設定（Branch `main` / Folder `/docs`） | `ai-docs/ENVIRONMENT.md` | ビルドなし |
| Google Fonts | 各テーマの `index.html` | — | 使うウェイトのみ読み込む |

## よく触るファイル

| 目的 | ファイル |
|---|---|
| コンテンツ更新 | `docs/shared/data.js` |
| テーマ追加・確率調整 | `docs/theme-router.js` |
| 共通クローム寸法調整 | `docs/shared/human-polish.css` |
