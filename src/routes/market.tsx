import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/brand/app-shell";

export const Route = createFileRoute("/market")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: MarketPage,
});

function MarketPage() {
  return (
    <AppShell>
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <header className="border-b border-border pb-6">
            <h1 className="display-xl text-foreground">Market</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Placeholder for marketplace functionality.
            </p>
          </header>
          <div className="text-muted-foreground">
            Marketplace functionality is currently unavailable. No data, prices, orders, wallet or
            subscription listings are fabricated here.
          </div>
        </div>
      </main>
    </AppShell>
  );
}
