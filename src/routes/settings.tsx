import { createFileRoute, redirect } from "@tanstack/react-router";
import { SettingsPage } from "@/components/profile/settings-page";

export const Route = createFileRoute("/settings")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: SettingsPage,
});
