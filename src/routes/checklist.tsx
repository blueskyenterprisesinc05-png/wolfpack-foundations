import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/brand/app-shell";
import { ChecklistPage } from "@/components/checklist/checklist-page";

export const Route = createFileRoute("/checklist")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: () => (
    <AppShell>
      <ChecklistPage />
    </AppShell>
  ),
});
