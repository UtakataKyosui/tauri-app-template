import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/toaster";
import { useTheme } from "@/hooks/use-theme";
import { commands } from "@/lib/bindings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { router } from "./router";
import "./i18n";

export function AppProviders() {
  const [queryClient] = useState(() => new QueryClient());
  useTheme();

  // FE-06: フロントの初期化（Provider のマウント）が終わったらスプラッシュを閉じる。
  // ブラウザプレビュー等 Tauri 外で動かした場合は invoke が失敗するだけなので無視する。
  useEffect(() => {
    commands.closeSplashscreen().catch(() => {});
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
