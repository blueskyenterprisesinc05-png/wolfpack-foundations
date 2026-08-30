import { createFileRoute } from "@tanstack/react-router";
import { SettingsAccountPage } from "@/components/profile/settings-account-page";

export const Route = createFileRoute("/settings/account")({
  component: function SettingsAccountRoute() {
    const { user, profile } = Route.useRouteContext();
    return <SettingsAccountPage user={user} profile={profile} />;
  },
});
