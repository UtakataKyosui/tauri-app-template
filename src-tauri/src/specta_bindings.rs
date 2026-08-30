//! RS-05 / GEN-01: tauri-specta によるコマンド定義の正本。
//!
//! ここに登録したコマンドから `src/lib/bindings.ts` を生成する（`cargo run --bin gen-bindings`、
//! `pnpm generate:bindings`）。コマンドを追加したら必ずここにも登録すること。生成物は
//! 手編集禁止（GEN-03）。CI で再生成し、差分が出たら失敗させる（GEN-02）。

use tauri_specta::{collect_commands, collect_events, Builder};

pub fn typed_builder() -> Builder {
    // collect_commands! / collect_events! はマクロが生成する補助アイテムを探すため、
    // `pub use` 経由の再エクスポートパスではなく、定義されたモジュールパスを直接指定する。
    Builder::<tauri::Wry>::new()
        .commands(collect_commands![
            crate::commands::greeting::greet,
            crate::commands::credentials::save_credential,
            crate::commands::credentials::has_credential,
            crate::commands::credentials::delete_credential,
            crate::commands::long_task::start_long_task,
            crate::commands::long_task::cancel_long_task,
            crate::commands::notes::create_note,
            crate::commands::notes::list_notes,
            crate::commands::notes::delete_note,
            crate::commands::window::close_splashscreen,
        ])
        .events(collect_events![crate::tasks::TaskProgress])
}

#[cfg(debug_assertions)]
pub fn export_path() -> &'static str {
    "../src/lib/bindings.ts"
}
