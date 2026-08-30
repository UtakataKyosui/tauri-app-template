//! RS-05 / GEN-01: tauri-specta によるコマンド定義の正本。
//!
//! ここに登録したコマンドから `src/lib/bindings.ts` を生成する（`cargo run --bin gen-bindings`、
//! `pnpm generate:bindings`）。コマンドを追加したら必ずここにも登録すること。生成物は
//! 手編集禁止（GEN-03）。CI で再生成し、差分が出たら失敗させる（GEN-02）。

use tauri_specta::{collect_commands, Builder};

pub fn typed_builder() -> Builder {
    // collect_commands! はマクロが生成する補助アイテムを探すため、`pub use` 経由の
    // 再エクスポートパスではなく、コマンドが定義されたモジュールパスを直接指定する。
    Builder::<tauri::Wry>::new().commands(collect_commands![crate::commands::greeting::greet])
}

#[cfg(debug_assertions)]
pub fn export_path() -> &'static str {
    "../src/lib/bindings.ts"
}
