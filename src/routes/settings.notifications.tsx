import { createFileRoute } from "@tanstack/react-router";
import { SettingsNotificationsPage } from "@/components/profile/settings-notifications-page";

export const Route = createFileRoute("/settings/notifications")({
  component: function SettingsNotificationsRoute() {
    return <SettingsNotificationsPage />;
  },
});
