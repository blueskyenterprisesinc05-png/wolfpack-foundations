import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/brand/app-shell";
import { RestoredPage } from "@/components/brand/restored-pages";

export const Route = createFileRoute("/mindset")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: () => (
    <AppShell>
      <RestoredPage kind="mindset" />
    </AppShell>
  ),
});
