import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/brand/app-shell";

export const Route = createFileRoute("/chat")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: ChatPage,
});

export function ChatPage() {
  return (
    <AppShell>
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <header className="border-b border-border pb-6">
            <h1 className="display-xl text-foreground">Chat</h1>
            <p className="mt-2 text-sm text-muted-foreground">Campus and community channels.</p>
          </header>
          <div className="text-muted-foreground">
            Chat campus and channels will be implemented in Phase 2.
          </div>
        </div>
      </main>
    </AppShell>
  );
}
