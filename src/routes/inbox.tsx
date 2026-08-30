import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/brand/app-shell";
import { Send } from "lucide-react";

export const Route = createFileRoute("/inbox")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: InboxPage,
});

function InboxPage() {
  return (
    <AppShell>
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <header className="border-b border-border pb-6">
            <h1 className="display-xl text-foreground">Inbox</h1>
            <p className="mt-2 text-sm text-muted-foreground">Private messages.</p>
          </header>
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              Inbox functionality will be implemented in later phases. No message persistence,
              unread counts, or security claims are currently active.
            </p>
            <div className="flex items-center gap-2 mt-4 opacity-50">
              <input
                type="text"
                disabled
                placeholder="Private messages unavailable..."
                className="flex-1 bg-secondary border border-border rounded-md px-4 py-2"
              />
              <button
                disabled
                className="bg-secondary text-muted-foreground border border-border px-4 py-2 rounded-md flex items-center gap-2 cursor-not-allowed"
              >
                <Send className="size-4" /> Send (Unavailable)
              </button>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
