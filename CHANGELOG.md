# Changelog

## [0.2.0](https://github.com/UtakataKyosui/tauri-app-template/compare/v0.1.0...v0.2.0) (2026-08-31)


### Features

* add CI pipeline, TDD enforcement hooks, and Copilot review ruleset ([8724e98](https://github.com/UtakataKyosui/tauri-app-template/commit/8724e98baca3bced011236ffea77502685513842))
* add deep linking, responsive layout, and Android release build ([cd61bcc](https://github.com/UtakataKyosui/tauri-app-template/commit/cd61bcc3bee7606166ee96b8dc3c96c5b85ae61f))
* add desktop tray/menu/updater and release workflow ([3865cee](https://github.com/UtakataKyosui/tauri-app-template/commit/3865ceea3d36fe92a1827fa3d7669711413fa1a2))
* add scaffolding generator and foundational Phase 3 features ([783d3e9](https://github.com/UtakataKyosui/tauri-app-template/commit/783d3e9eeba1ffe9364e642b5a06ad1133e6f93a))
* **demo:** 外部リンクを Safari で明示指定して開けるようにする ([#55](https://github.com/UtakataKyosui/tauri-app-template/issues/55)) ([ff0f7d8](https://github.com/UtakataKyosui/tauri-app-template/commit/ff0f7d8c26657a745afac7a29e3df4a49ae42a3d))
* **demo:** 画像ファイル選択時にプレビュー表示する ([#53](https://github.com/UtakataKyosui/tauri-app-template/issues/53)) ([080bc2a](https://github.com/UtakataKyosui/tauri-app-template/commit/080bc2a934f377f55944de1882b68dbe2e2dac26)), closes [#34](https://github.com/UtakataKyosui/tauri-app-template/issues/34)
* scaffold project foundation, Rust workspace, frontend, and test infra ([c5d1938](https://github.com/UtakataKyosui/tauri-app-template/commit/c5d193852ac67a4c8bd127d51bb8132d1da5dfac))


### Bug Fixes

* avoid vitest watch-mode hang in lefthook pre-push ([98ea68d](https://github.com/UtakataKyosui/tauri-app-template/commit/98ea68d3b5165992d0fa219f8f85a25a21a2b16e))
* **build:** tauri dev 起動時に bin ターゲットを明示する ([#42](https://github.com/UtakataKyosui/tauri-app-template/issues/42)) ([4664cc2](https://github.com/UtakataKyosui/tauri-app-template/commit/4664cc2d5b88a80b9350fc3809c2d8a54a5b563a)), closes [#35](https://github.com/UtakataKyosui/tauri-app-template/issues/35)
* **ci:** actually fix the Windows STATUS_ENTRYPOINT_NOT_FOUND test failure ([b8a899b](https://github.com/UtakataKyosui/tauri-app-template/commit/b8a899b7d572c2e398987accd56dcba147123943))
* **ci:** fix hook robustness, workflow hardening, and stray tsc output ([6801d02](https://github.com/UtakataKyosui/tauri-app-template/commit/6801d020d38c5360b97653b1d770d1caaf9bf132))
* **ci:** generate a proper .rc script for the test-manifest embed ([05509d1](https://github.com/UtakataKyosui/tauri-app-template/commit/05509d1c059a507650c4907567e0074dacf7a89e))
* **ci:** generate routeTree.gen.ts and i18n keys before typecheck/build ([24deabd](https://github.com/UtakataKyosui/tauri-app-template/commit/24deabd056ab31a9dd1c7bdc1d95cbaba668266d))
* **ci:** use a stable linker arg instead of the nightly-only rustc-link-arg-tests ([e853bc2](https://github.com/UtakataKyosui/tauri-app-template/commit/e853bc22ac2dfd4990c9f222126c9aec68e42646))
* **demo:** 既定ブラウザが外部リンクを握り潰す既知の制約を明記する ([#52](https://github.com/UtakataKyosui/tauri-app-template/issues/52)) ([4bbf3bf](https://github.com/UtakataKyosui/tauri-app-template/commit/4bbf3bf9f332ce337d748efebc3d354fbbc48cb6)), closes [#38](https://github.com/UtakataKyosui/tauri-app-template/issues/38)
* **demo:** 自動更新デモの状態を未確認・確認中・更新なし・更新あり・失敗の5つに分離 ([#51](https://github.com/UtakataKyosui/tauri-app-template/issues/51)) ([a94fc9a](https://github.com/UtakataKyosui/tauri-app-template/commit/a94fc9a7cf1e5ac9408d0f30579898a93e9fb6e3)), closes [#36](https://github.com/UtakataKyosui/tauri-app-template/issues/36)
* **demo:** 通知権限の状態を画面表示し、dev実行時の既知の制約を明記 ([#47](https://github.com/UtakataKyosui/tauri-app-template/issues/47)) ([42707ea](https://github.com/UtakataKyosui/tauri-app-template/commit/42707ea88df71326a16440c77ed77518b51a4c46)), closes [#37](https://github.com/UtakataKyosui/tauri-app-template/issues/37)
* **frontend:** apply multi-agent review findings on i18n, security, and UX ([597f933](https://github.com/UtakataKyosui/tauri-app-template/commit/597f933fabba8961b45972ca676f13aba5b03140))
* **hooks:** pre-push の diff 基準を @{push} から origin/main に変更する ([#43](https://github.com/UtakataKyosui/tauri-app-template/issues/43)) ([99e9d2d](https://github.com/UtakataKyosui/tauri-app-template/commit/99e9d2d12f86d7d4523cbfdd7102efa9b2a7df71))
* **rust:** stop swallowing errors and panicking on recoverable startup failures ([8744b76](https://github.com/UtakataKyosui/tauri-app-template/commit/8744b762f15cad0d274d187c868ae39339181a83))
* **security:** stop granting capabilities for unimplemented P2 plugins ([f29ef53](https://github.com/UtakataKyosui/tauri-app-template/commit/f29ef53f66021aec983c5e3b65a0ffce90d4e4d0))
* **test:** exclude .claude/worktrees/ from vitest discovery ([63163e2](https://github.com/UtakataKyosui/tauri-app-template/commit/63163e2481c96c9a586587ebe32da5149c390530))
* **toast:** auto-dismiss toasts and cap stacking ([#46](https://github.com/UtakataKyosui/tauri-app-template/issues/46)) ([77b8d13](https://github.com/UtakataKyosui/tauri-app-template/commit/77b8d132b754a5cf089463f76f98e3466b11024b)), closes [#39](https://github.com/UtakataKyosui/tauri-app-template/issues/39)

## Changelog

このファイルは [release-please](https://github.com/googleapis/release-please) が
Conventional Commits（QA-12）から自動生成する。手編集しないこと。
