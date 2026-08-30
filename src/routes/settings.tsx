import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/brand/app-shell";
import { SettingsPage } from "@/components/profile/settings-page";

export const Route = createFileRoute("/settings")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: function SettingsRoute() {
    const { user, profile } = Route.useRouteContext();
    return (
      <AppShell>
        <SettingsPage user={user} profile={profile} />
      </AppShell>
    );
  },
});
