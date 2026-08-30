//! デスクトップ専用機能（`#[cfg(desktop)]`）。トレイ・メニュー・ウィンドウ状態・単一インスタンス・
//! 自動更新は Phase 4（#20, #21）で実装する。このモジュールへ `#[cfg(mobile)]` 側からは
//! 到達不可能であることをコンパイル時に強制する（レビュー観点 §3）。

use tauri::{App, AppHandle, Manager};

/// デスクトップ固有のセットアップを `lib.rs::run()` から呼び出すためのフック。
/// 現時点ではプレースホルダ。Phase 4 でトレイ・メニュー等を追加する。
pub fn setup(_app: &mut App) -> tauri::Result<()> {
    log::debug!("desktop setup placeholder (see #20)");
    Ok(())
}

/// APP-07: 単一インスタンス制御 — 二重起動時に既存ウィンドウを前面化する。
/// 本実装は Phase 4（#20）で行い、ここでは配線のみを Phase 1 で用意する。
pub fn focus_main_window_from_app(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.set_focus();
    }
}
