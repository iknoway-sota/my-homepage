# ARCHITECTURE.md

このファイルは、システムの構造、責務分担、境界を記録するためのドキュメントです。
細かい実装説明ではなく、変更時に守るべき設計の骨格を残します。

## 自動更新ルール

以下が変わった場合は、このファイルを更新してください。

- サイト構成、データフロー、状態管理方針を変えた。
- テーマと共通資産の責務分担を変えた。
- 重要な依存関係や境界を追加・削除した。
- 設計判断を変更した。

重要な判断をした場合は `ai-docs/DECISIONS.md` にも記録してください。

## 概要

```text
訪問者
  -> docs/index.html（ローダー）
  -> docs/theme-router.js（重み付きランダムでテーマ選択、localStorage で保持）
  -> docs/themes/<name>/index.html（選ばれたテーマ）
       ├─ shared/data.js   … window.__data（全コンテンツ）
       ├─ shared/utils.js  … window.__utils
       ├─ shared/games.js / projects.js / snap.js … 共通セクション挿入
       ├─ shared/human-polish.css … 共通クローム寸法
       └─ テーマ固有の style.css / script.js … 世界観・描画
```

純粋な静的サイト。サーバー処理・ビルドステップ・外部ライブラリはない。

## レイヤーと責務

| レイヤー | 責務 | 置き場所 |
|---|---|---|
| エントリ / ルーティング | ローダー表示、テーマ選択、端末内保持 | `docs/index.html`, `docs/theme-router.js` |
| コンテンツデータ | 全テーマ共通のコンテンツ（単一の正） | `docs/shared/data.js` |
| 共通資産 | ユーティリティ、共通セクション挿入、共通クローム寸法 | `docs/shared/` |
| テーマ | 世界観（配色・フォント・演出）と `window.__data` の描画 | `docs/themes/<name>/` |
| AI ドキュメント | 作業ルール・設計・運用の記録 | `AGENTS.md`, `DESIGN.md`, `ai-docs/`, `.agents/skills/` |

## データフロー

| 流れ | 説明 | 入口 |
|---|---|---|
| テーマ選択 | URL パラメータ（`?theme=` / `?switch=1`）と `localStorage` を確認し、重み付きランダムで選択して遷移。自動ガチャがONなら再読み込み時も別テーマを選ぶ | `docs/theme-router.js` |
| コンテンツ描画 | ページ読み込み時に各テーマの `script.js` が `window.__data` を読んで DOM を生成 | 各テーマの `script.js` |
| セクション自動挿入 | `games.js` / `projects.js` が該当セクションを DOM に挿入 | `docs/shared/games.js`, `docs/shared/projects.js` |

## 状態管理

| 種類 | 管理場所 | 永続化 | 注意 |
|---|---|---|---|
| 選択中テーマ | `localStorage` | 次回訪問まで | 自動ガチャがOFFならリロード・再訪で同じテーマ。切替ボタンで別テーマを保存 |
| 自動テーマガチャ | `localStorage`（`randomThemeOnReload`） | あり | ONならテーマ個別ページの再読み込みを入口へ戻し、現在とは別のテーマを選ぶ |
| ユーザー設定類 | `localStorage`（`__utils.getLocal` / `setLocal` 経由） | あり | try-catch 付きヘルパーを使う |
| サーバー状態 | なし | — | バックエンドなし |

## 境界ルール

- コンテンツはテーマにハードコードしない。`docs/shared/data.js` を単一の正とする。
- テーマ固有の実装はそのテーマのディレクトリに閉じる。テーマ間の直接依存を作らない。
- 共通化は「複数テーマで実際に必要になった」ものだけを `docs/shared/` に切り出す。
- `shared/*.js` の公開は `window.__data` / `window.__utils` などのグローバル変数経由（モジュールバンドラーなし）。
- スクリプト読み込み順を守る: `data.js` → `games.js` → `projects.js` → `snap.js` → テーマ `script.js`。
- CSS は テーマ `style.css` → `shared/human-polish.css` の順（寸法の共通レイヤーが後勝ち）。
- 例外的な依存を追加した場合は理由を `ai-docs/DECISIONS.md` に残す。

## 依存関係

| 依存 | 用途 | 代替 / 注意 |
|---|---|---|
| Google Fonts | 各テーマのフォント | 使うウェイトのみ。`font-display: swap` |
| ブラウザ標準 API | Canvas / IntersectionObserver / localStorage など | ポリフィルなし。フォールバック前提で段階導入 |

外部 JS ライブラリへの依存はゼロ。維持を優先する。

## 拡張時の方針

- 新テーマは既存テーマの構成（`index.html` / `style.css` / `script.js`）をコピーせず参考にし、同じ契約（`window.__data` 描画、共通クロームクラス）に従う。
- 新しい抽象化は、実際の重複や複雑さを減らす場合だけ追加する。
- `data.js` のスキーマを変える場合は、全テーマの描画への影響を確認し、`DESIGN.md` のスキーマ記載も更新する。

## 既知の制約

- `file://` 直開きでは Canvas などが制限される場合がある（ローカルサーバー推奨）。
- GitHub Pages は Jekyll 経由のため、`docs/` 内に `_` 始まりのファイルを置かない。
- `main` へのプッシュが即本番反映になる（検証環境なし）。
