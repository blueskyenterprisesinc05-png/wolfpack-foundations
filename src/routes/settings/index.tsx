import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/profile/settings-page";

export const Route = createFileRoute("/settings/")({
  component: function SettingsIndexRoute() {
    const { user, profile } = Route.useRouteContext();
    return <SettingsPage user={user} profile={profile} />;
  },
});
