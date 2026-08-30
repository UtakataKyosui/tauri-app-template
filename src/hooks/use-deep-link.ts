import { onOpenUrl } from "@tauri-apps/plugin-deep-link";
import { useEffect } from "react";

/**
 * APP-09: ディープリンク（カスタム URL スキーム `tauri-app-template://`）。
 * OAuth コールバック等を受けるための土台。実際の処理（トークン交換など）を追加する場合は
 * ここでパースして `src/lib/api/**` 経由でコマンドに渡す。
 */
export function useDeepLink(onUrl: (url: string) => void) {
  useEffect(() => {
    const unlisten = onOpenUrl((urls) => {
      for (const url of urls) onUrl(url);
    });
    return () => {
      unlisten.then((f) => f());
    };
  }, [onUrl]);
}
