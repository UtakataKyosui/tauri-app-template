//! アプリのビルダー本体。デスクトップ（main.rs）とモバイル（`mobile_entry_point`）の
//! 両方からここを呼び出す（RS-01）。

pub mod commands;
pub mod credentials;
#[cfg(desktop)]
pub mod desktop;
pub mod error;
pub mod http_client;
pub mod logging;
#[cfg(mobile)]
pub mod mobile;
pub mod panic_handler;
pub mod specta_bindings;
pub mod state;
pub mod tasks;

use tauri::Manager;

use state::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    panic_handler::install();

    let builder = specta_bindings::typed_builder();

    let mut app_builder = tauri::Builder::default()
        .plugin(logging::plugin())
        .plugin(tauri_plugin_store::Builder::new().build())
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

            // RS-08/RS-09: DB 接続は OS 標準のアプリデータディレクトリ配下に作る。
            // setup は同期クロージャのため、接続とマイグレーション適用は block_on する。
            let app_handle = app.handle().clone();
            let pool = tauri::async_runtime::block_on(async move {
                let data_dir = app_handle
                    .path()
                    .app_data_dir()
                    .expect("could not resolve app data dir");
                std::fs::create_dir_all(&data_dir).expect("failed to create app data dir");
                let db_path = data_dir.join("app.sqlite");
                app_core::db::connect_persistent(db_path.to_string_lossy().as_ref())
                    .await
                    .expect("failed to connect to database")
            });
            app.manage(pool);

            #[cfg(desktop)]
            desktop::setup(app)?;
            #[cfg(mobile)]
            mobile::setup(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
