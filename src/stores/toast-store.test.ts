import { beforeEach, describe, expect, it } from "vitest";
import { useToastStore } from "./toast-store";

describe("useToastStore", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it("starts with no toasts", () => {
    expect(useToastStore.getState().toasts).toEqual([]);
  });

  it("pushes a toast with a generated id", () => {
    useToastStore.getState().push({ title: "Saved" });

    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0]?.title).toBe("Saved");
    expect(toasts[0]?.id).toBeTruthy();
  });

  it("keeps previously pushed toasts when pushing a new one", () => {
    useToastStore.getState().push({ title: "First" });
    useToastStore.getState().push({ title: "Second" });

    expect(useToastStore.getState().toasts.map((t) => t.title)).toEqual(["First", "Second"]);
  });

  it("dismisses a toast by id", () => {
    useToastStore.getState().push({ title: "Removable" });
    const toasts = useToastStore.getState().toasts;
    const toast = toasts[0];
    if (!toast) throw new Error("expected a toast to have been pushed");

    useToastStore.getState().dismiss(toast.id);

    expect(useToastStore.getState().toasts).toEqual([]);
  });
});
