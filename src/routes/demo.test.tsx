import i18n from "@/app/i18n";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NotificationDemo } from "./demo";

const { isPermissionGranted, requestPermission, sendNotification } = vi.hoisted(() => ({
  isPermissionGranted: vi.fn(),
  requestPermission: vi.fn(),
  sendNotification: vi.fn(),
}));

vi.mock("@tauri-apps/plugin-notification", () => ({
  isPermissionGranted,
  requestPermission,
  sendNotification,
}));

describe("NotificationDemo", () => {
  it("shows the granted permission status once isPermissionGranted resolves", async () => {
    isPermissionGranted.mockResolvedValue(true);

    render(<NotificationDemo onError={vi.fn()} />);

    expect(screen.getByText(i18n.t("demo.notification.permissionChecking"))).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(i18n.t("demo.notification.permissionGranted"))).toBeInTheDocument();
    });
  });

  it("shows the dev-mode note about macOS discarding un-bundled notifications", async () => {
    isPermissionGranted.mockResolvedValue(true);

    render(<NotificationDemo onError={vi.fn()} />);

    expect(screen.getByText(i18n.t("demo.notification.devNote"))).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(i18n.t("demo.notification.permissionGranted"))).toBeInTheDocument();
    });
  });

  it("reports the denied error and updates the status when permission is refused", async () => {
    isPermissionGranted.mockResolvedValue(false);
    requestPermission.mockResolvedValue("denied");
    const onError = vi.fn();
    const user = userEvent.setup();

    render(<NotificationDemo onError={onError} />);
    await user.click(screen.getByRole("button", { name: i18n.t("demo.notification.send") }));

    expect(onError).toHaveBeenCalledWith(i18n.t("demo.notification.denied"));
    expect(sendNotification).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(
        screen.getByText(i18n.t("demo.notification.permissionNotGranted")),
      ).toBeInTheDocument();
    });
  });
});
