fn main() {
    tauri_build::build();

    // tauri-build only embeds the Common Controls v6 manifest into `[[bin]]`
    // targets (`cargo:rustc-link-arg-bins`), not into `cargo test` binaries.
    // Without it, test executables load Common Controls v5 and fail to start
    // with STATUS_ENTRYPOINT_NOT_FOUND as soon as they link anything that
    // depends on Tauri's Windows dialog code (e.g. `tauri::test::mock_app`).
    // See https://github.com/tauri-apps/tauri/issues/13419.
    if std::env::var("CARGO_CFG_TARGET_OS").as_deref() == Ok("windows") {
        embed_resource::compile_for_tests("windows-test-manifest.xml", embed_resource::NONE)
            .manifest_required()
            .unwrap();
    }
}
