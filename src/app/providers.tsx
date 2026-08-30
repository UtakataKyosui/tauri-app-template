import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/toaster";
import { useTheme } from "@/hooks/use-theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { useState } from "react";
import { router } from "./router";
import "./i18n";

export function AppProviders() {
  const [queryClient] = useState(() => new QueryClient());
  useTheme();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
