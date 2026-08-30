import { create } from "zustand";

export interface Toast {
  id: string;
  title: string;
  variant?: "default" | "destructive";
}

interface ToastState {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

/**
 * FE-05: Rust 側エラーの共通表示先。`src/lib/api/**` で捕まえた例外や
 * ErrorBoundary はここに push し、`src/components/toaster.tsx` が描画する。
 */
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
