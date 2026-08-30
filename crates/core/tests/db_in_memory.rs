//! QA-07: DB を含むテストの雛形。インメモリ SQLite を使い、テストごとに独立した
//! 接続・スキーマを構築する。実際のマイグレーション埋め込み（RS-09）は Phase 3 で追加し、
//! このテストはその配線を差し替える。

use app_core::db::connect_in_memory;

#[tokio::test]
async fn each_test_gets_an_independent_in_memory_database() {
    let pool = connect_in_memory().await.expect("failed to connect");

    sqlx::query("CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT NOT NULL)")
        .execute(&pool)
        .await
        .expect("failed to create schema");

    sqlx::query("INSERT INTO items (name) VALUES (?1)")
        .bind("first")
        .execute(&pool)
        .await
        .expect("failed to insert");

    let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM items")
        .fetch_one(&pool)
        .await
        .expect("failed to count");

    assert_eq!(count.0, 1);
}

#[tokio::test]
async fn a_second_test_does_not_see_data_from_the_first() {
    let pool = connect_in_memory().await.expect("failed to connect");

    sqlx::query("CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT NOT NULL)")
        .execute(&pool)
        .await
        .expect("failed to create schema");

    let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM items")
        .fetch_one(&pool)
        .await
        .expect("failed to count");

    assert_eq!(count.0, 0);
}
