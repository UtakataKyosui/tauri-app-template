//! DB アクセス層。SQLite への接続は呼び出し側から `SqlitePool` を引数で受け取り、
//! グローバル状態からは取得しない（docs/testing.md §3「DB 接続は引数で受け取る」）。
//!
//! マイグレーションと具体的なクエリは Phase 3（#16, RS-08/RS-09）で追加する。
//! ここでは Phase 1 の完了条件である「インメモリ SQLite に対する統合テストの雛形」
//! （QA-07）が動くことだけを保証する最小の接続ヘルパーを置く。

use sqlx::sqlite::{SqlitePool, SqlitePoolOptions};

/// テスト・開発用にインメモリ SQLite への接続プールを作る。
///
/// 本番用の永続 DB 接続（ファイルパス指定、マイグレーション適用）は Phase 3 で
/// `connect_persistent` として追加する。
pub async fn connect_in_memory() -> Result<SqlitePool, sqlx::Error> {
    SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
}
