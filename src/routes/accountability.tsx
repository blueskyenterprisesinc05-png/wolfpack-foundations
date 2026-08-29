import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/brand/app-shell";
import { AccountabilityPage } from "@/components/accountability/accountability-page";

export const Route = createFileRoute("/accountability")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: () => (
    <AppShell>
      <AccountabilityPage />
    </AppShell>
  ),
});
