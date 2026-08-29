import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/brand/app-shell";

export const Route = createFileRoute("/checklist")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: () => (
    <AppShell>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-8 text-center lg:min-h-screen">
        <h1 className="display-lg text-foreground">Daily Checklist</h1>
        <p className="mt-4 text-muted-foreground">Checklist implementation (Phase 4).</p>
      </div>
    </AppShell>
  ),
});
