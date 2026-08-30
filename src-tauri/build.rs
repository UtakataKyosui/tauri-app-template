fn main() {
    tauri_build::build();

    // tauri-build only embeds the Common Controls v6 manifest into `[[bin]]`
    // targets (`cargo:rustc-link-arg-bins`), not into `cargo test` binaries.
    // Without it, test executables load Common Controls v5 and fail to start
    // with STATUS_ENTRYPOINT_NOT_FOUND as soon as they link anything that
    // depends on Tauri's Windows dialog code (e.g. `tauri::test::mock_app`).
    // See https://github.com/tauri-apps/tauri/issues/13419.
    if std::env::var("CARGO_CFG_TARGET_OS").as_deref() == Ok("windows") {
        // `embed_resource::compile_for_tests` takes an .rc resource script, not
        // a raw manifest XML file, so generate a minimal one that points the
        // resource compiler (RT_MANIFEST = 24, id 1 = the exe manifest slot)
        // at the manifest file.
        let manifest_dir = std::env::var("CARGO_MANIFEST_DIR").unwrap();
        let manifest_path = std::path::Path::new(&manifest_dir).join("windows-test-manifest.xml");
        let out_dir = std::env::var("OUT_DIR").unwrap();
        let rc_path = std::path::Path::new(&out_dir).join("windows-test-manifest.rc");
        // Forward slashes avoid having to escape backslashes in the RC string
        // literal; the resource compiler accepts them in file paths.
        let manifest_path_str = manifest_path.display().to_string().replace('\\', "/");
        std::fs::write(&rc_path, format!("1 24 \"{manifest_path_str}\"\n")).unwrap();

        embed_resource::compile_for_tests(&rc_path, embed_resource::NONE)
            .manifest_required()
            .unwrap();
    }
}
