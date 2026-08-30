//! アプリのビルダー本体。デスクトップ（main.rs）とモバイル（`mobile_entry_point`）の
//! 両方からここを呼び出す（RS-01）。

pub mod commands;
#[cfg(desktop)]
pub mod desktop;
pub mod error;
#[cfg(mobile)]
pub mod mobile;
pub mod specta_bindings;
pub mod state;

use state::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    init_logging();

    let builder = specta_bindings::typed_builder();

    let mut app_builder = tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .manage(AppState::default())
        .invoke_handler(builder.invoke_handler());

    #[cfg(desktop)]
    {
        app_builder = app_builder
            .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
                #[cfg(desktop)]
                desktop::focus_main_window_from_app(app);
            }))
            .plugin(tauri_plugin_window_state::Builder::default().build())
            .plugin(tauri_plugin_global_shortcut::Builder::new().build())
            .plugin(tauri_plugin_autostart::init(
                tauri_plugin_autostart::MacosLauncher::LaunchAgent,
                None,
            ))
            .plugin(tauri_plugin_updater::Builder::new().build());
    }

    #[cfg(mobile)]
    {
        app_builder = app_builder.plugin(tauri_plugin_biometric::init());
    }

    app_builder
        .setup(move |app| {
            builder.mount_events(app);

            #[cfg(desktop)]
            desktop::setup(app)?;
            #[cfg(mobile)]
            mobile::setup(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn init_logging() {
    use tracing_subscriber::EnvFilter;

    // RS-07 でファイル出力・ローテーションへ拡張する（Phase 3, #15）。
    // ここでは RUST_LOG によるレベル制御のみを Phase 1 の完了条件として満たす。
    let _ = tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .try_init();
}
