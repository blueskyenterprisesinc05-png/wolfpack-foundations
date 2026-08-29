import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/brand/app-shell";
import { ProgressDashboard } from "@/components/progress/progress-dashboard";

export const Route = createFileRoute("/progress")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: () => (
    <AppShell>
      <ProgressDashboard />
    </AppShell>
  ),
});
