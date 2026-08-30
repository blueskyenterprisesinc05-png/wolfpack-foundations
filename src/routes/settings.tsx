import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/brand/app-shell";

export const Route = createFileRoute("/settings")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: function SettingsRoute() {
    return (
      <AppShell>
        <Outlet />
      </AppShell>
    );
  },
});
