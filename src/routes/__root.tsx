import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col">
      <nav className="flex gap-4 border-b border-border px-4 py-3 pt-safe-top">
        <Link to="/" className="text-sm font-medium [&.active]:text-primary">
          {t("nav.home")}
        </Link>
        <Link to="/settings" className="text-sm font-medium [&.active]:text-primary">
          {t("nav.settings")}
        </Link>
        <Link to="/demo" className="text-sm font-medium [&.active]:text-primary">
          {t("nav.demo")}
        </Link>
      </nav>
      <main className="flex-1 p-4 pb-safe-bottom">
        <Outlet />
      </main>
    </div>
  );
}
