# アーキテクチャ

層構成、コマンドの追加手順、型生成の流れをまとめる。`docs/requirements.md` §5 のディレクトリ構成が前提。

## 1. 層構成

```
crates/core   … tauri に依存しない純粋ロジック + DB アクセス。TDD の主戦場
src-tauri     … Tauri アプリ本体。commands/ は core を呼ぶ薄いアダプタのみ
src/lib/api   … bindings.ts (生成物) を一段ラップしたフロントの呼び出し口
src/          … React (UI・状態・ルーティング)
```

依存の向きは一方向。`crates/core` は `src-tauri` や `tauri` クレートに依存しない
（Cargo.toml のコメントおよびレビュー観点 §2 で強制する）。フロントは `src/lib/bindings.ts`
を直接使わず、必ず `src/lib/api/**` を経由する（docs/testing.md §3）。

## 2. コマンドを 1 つ追加する手順

1. `crates/core/src/domain/` にロジックとユニットテストを追加する（Red→Green→Refactor）
2. `src-tauri/src/commands/` に薄いアダプタを追加する。中身は入力の変換・検証と
   `app_core::domain::...` の呼び出しのみ。`#[tauri::command]` と `#[specta::specta]` を付ける
3. `src-tauri/src/specta_bindings.rs` の `collect_commands![...]` に登録する
4. `src-tauri/src/lib.rs` の `invoke_handler` は `specta_bindings::typed_builder()` 経由なので
   変更不要
5. `pnpm generate:bindings` を実行し `src/lib/bindings.ts` を再生成する
6. `src/lib/api/` に薄いラッパー関数を追加する（エラーを呼び出し側が扱いやすい形に正規化）
7. 必要なら `src-tauri/capabilities/*.json` に権限を追加する（最小権限。RS-03/SEC-03）

機能追加一式（core・コマンド・フロント・テスト）をまとめて生成するジェネレータは
Phase 3（#14, GEN-04）で追加する。

## 3. 型生成の流れ（RS-05 / GEN-01）

```
src-tauri/src/specta_bindings.rs  (正本: コマンド定義)
        │  tauri-specta (`cargo run --bin gen-bindings`)
        ▼
src/lib/bindings.ts                (生成物・手編集禁止)
        │  一段ラップ
        ▼
src/lib/api/**                     (フロントが実際に呼ぶ層)
```

CI は `pnpm generate:bindings` を実行後 `git diff --exit-code` で差分を検出し、
ずれたまま動く状態を防ぐ（GEN-02、`.github/workflows/ci.yml`）。

## 4. 状態管理の使い分け（FE-04）

| 対象 | 手段 | 置き場所 |
|---|---|---|
| Rust 呼び出しの結果（ローディング・エラー・キャッシュ） | TanStack Query | `src/hooks/` |
| UI のみの状態（テーマ、開閉状態など） | Zustand | `src/stores/` |

Rust から取得するデータを Zustand に手動でコピーしない。TanStack Query のキャッシュを
正とする。

## 5. 機密情報の扱い（SEC-04）

- トークン・鍵・パスワードは Rust 側（`src-tauri` / `crates/core`）でのみ保持する
- OS キーチェーン連携（RS-12, Phase 3）を経由して保存し、平文でディスクに書かない
- フロントには「必要な操作の実行結果」だけを command 経由で返す。トークンそのものは
  絶対にフロントへ返さない・ログへ出さない（レビュー観点 §1）
- 環境変数はフロントに公開するものだけ `VITE_` 接頭辞を付ける（BASE-04, `.env.example`）

## 6. エラーの伝搬

```
app_core::CoreError  →  src-tauri::AppError (#[from])  →  serde  →  フロント (bindings.ts)
```

コマンド経路で `unwrap()` / `expect()` / `panic!` を使わない。全て `Result<T, AppError>` を返す
（レビュー観点 §2）。フロントは `src/lib/api/**` で例外に正規化し、
`src/stores/toast-store.ts` → `src/components/toaster.tsx` でユーザーに伝える（FE-05）。

## 7. プラットフォーム分岐

- Rust: `#[cfg(desktop)]` → `src-tauri/src/desktop/`、`#[cfg(mobile)]` → `src-tauri/src/mobile/`
- TS: `src/lib/platform.ts` の `isDesktop()` / `isMobile()` で実行時分岐する
- デスクトップ専用 API を `crates/core` や共通コマンドに混入させない（CI のモバイルコンパイル確認で検出、リスク R-6）
