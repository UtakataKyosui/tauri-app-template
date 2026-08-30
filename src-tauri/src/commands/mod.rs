//! `#[tauri::command]` 群。入力の変換・検証と `app_core` の呼び出しのみを行う薄いアダプタ層。
//! ビジネスロジックはここに書かず `crates/core` に置くこと（docs/testing.md §3）。

pub mod greeting;

pub use greeting::greet;
