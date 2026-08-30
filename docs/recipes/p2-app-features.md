# P2 のアプリ機能の追加手順（APP-10〜13）

いずれも初版では見送り、必要になった時点で以下の方針で追加する。

## APP-10: グローバルショートカット（Desktop）

`tauri_plugin_global_shortcut` は `src-tauri/src/lib.rs` で既にプラグイン登録済み
（`#[cfg(desktop)]` 配下）。実際にショートカットを 1 つ登録する場合は
`desktop::setup()`（`src-tauri/src/desktop/mod.rs`）に以下のように追加する。

```rust
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut};

let shortcut = Shortcut::new(Some(Modifiers::CONTROL | Modifiers::SHIFT), Code::KeyK);
app.global_shortcut().register(shortcut)?;
```

`capabilities/desktop.json` に `global-shortcut:default`（登録済み）に加え、
特定のショートカットのみ許可する場合は `global-shortcut:allow-register` 等に絞る。

## APP-11: 自動起動（ログイン時起動, Desktop）

`tauri_plugin_autostart` も登録済み。有効化するコマンドを追加する。

```rust
use tauri_plugin_autostart::ManagerExt;

app.autolaunch().enable()?;
```

設定画面にトグルを追加し、`RS-08`（tauri-plugin-store）でユーザーの選択を永続化するとよい。

## APP-12: クリップボード連携（両プラットフォーム）

`@tauri-apps/plugin-clipboard-manager` を追加する。

```sh
pnpm add @tauri-apps/plugin-clipboard-manager
```

```rust
// src-tauri/src/lib.rs
.plugin(tauri_plugin_clipboard_manager::init())
```

`capabilities/default.json` に `clipboard-manager:default` を追加する（両プラットフォームで
使うため）。

## APP-13: 生体認証（Mobile 専用）

`tauri_plugin_biometric` は `#[cfg(mobile)]` 配下に既に登録済み
（`src-tauri/capabilities/mobile.json` の `biometric:default` も設定済み）。
フロントから `@tauri-apps/plugin-biometric` の `authenticate()` を呼ぶだけで使える。
デスクトップでは意味を持たないため、`src/lib/platform.ts` の `isMobile()` で UI を出し分けること
（レビュー観点 §3）。
