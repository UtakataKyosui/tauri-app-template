use std::sync::Arc;
use tokio::sync::RwLock;

/// アプリ全体で共有する状態の雛形（RS-06）。
///
/// - `tauri::State` 経由でコマンドに注入する
/// - ロックを保持したまま `await` しない（レビュー観点 §2）。値を取り出したら早めに drop する
#[derive(Default)]
pub struct AppState {
    inner: Arc<RwLock<AppStateInner>>,
}

#[derive(Default)]
struct AppStateInner {
    /// サンプル値。実際の永続設定は Phase 3（RS-08）で config ストアに置き換える。
    greet_count: u64,
}

impl AppState {
    pub async fn record_greeting(&self) -> u64 {
        let mut inner = self.inner.write().await;
        inner.greet_count += 1;
        inner.greet_count
    }
}
