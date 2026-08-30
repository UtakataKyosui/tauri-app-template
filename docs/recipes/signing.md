# 署名証明書の準備手順（CI-04 / CI-05）

`.github/workflows/release.yml` は証明書・鍵が未設定でもビルド自体は失敗しない
（署名ステップだけがスキップされる。リスク R-3）。実際に署名済みインストーラを配布する
には、以下の GitHub Secrets を登録する。

## 1. アップデータ用の署名鍵（必須。RS-12/CI-05）

```sh
pnpm tauri signer generate -w ~/.tauri/tauri-app-template.key
```

- 生成された公開鍵を `src-tauri/tauri.conf.json` の `plugins.updater.pubkey` に貼り付ける
- 秘密鍵の中身を Secrets `TAURI_SIGNING_PRIVATE_KEY` に登録する
- パスフレーズを設定した場合は `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` にも登録する

これが無いと自動アップデート（APP-08）の署名検証ができない。

## 2. macOS: Developer ID 署名 + 公証（CI-04）

Apple Developer Program（有償）への加入が前提。加入から実際に使えるまで
日数がかかることがあるため、Phase 4 に入る前に状況を確認しておくこと
（`docs/requirements.md` §7 未決事項 3）。

1. Xcode の Developer ID Application 証明書を書き出し、base64 化する
   ```sh
   base64 -i DeveloperIDApplication.p12 | pbcopy
   ```
2. 以下の Secrets を登録する
   - `APPLE_CERTIFICATE`（上記 base64）
   - `APPLE_CERTIFICATE_PASSWORD`
   - `APPLE_SIGNING_IDENTITY`（証明書の Common Name）
   - `APPLE_ID` / `APPLE_PASSWORD`（App 用 Apple ID とアプリ用パスワード）
   - `APPLE_TEAM_ID`

## 3. Windows: コード署名（CI-04）

1. コードサイニング証明書（.pfx）を base64 化する
2. Secrets `WINDOWS_CERTIFICATE`（base64）と `WINDOWS_CERTIFICATE_PASSWORD` を登録する

## 4. クラッシュレポートの外部送信について

現時点ではローカルログ（RS-07, RS-13）のみに留めている。外部送信サービスを追加する場合は
`docs/requirements.md` §7 未決事項 4 を参照し、収集する情報の範囲を SEC-04 の観点で見直すこと。
