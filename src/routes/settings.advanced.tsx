import { createFileRoute } from "@tanstack/react-router";
import { SettingsAdvancedPage } from "@/components/profile/settings-advanced-page";

export const Route = createFileRoute("/settings/advanced")({
  component: function SettingsAdvancedRoute() {
    return <SettingsAdvancedPage />;
  },
});
