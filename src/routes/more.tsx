import { createFileRoute, redirect, Link, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/brand/app-shell";
import {
  Settings,
  User,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { signOutFn } from "@/lib/auth";

export const Route = createFileRoute("/more")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: MorePage,
});

function MorePage() {
  const { profile } = Route.useRouteContext();
  const router = useRouter();

  const handleLogout = async () => {
    await signOutFn();
    router.invalidate();
  };

  const tierLabel =
    profile?.tier === "inner-circle"
      ? "Inner Circle"
      : profile?.tier === "member"
        ? "Member"
        : "Free";

  const menuItems = [
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Bell, label: "Notifications", href: "/settings/notifications" },
    { icon: CreditCard, label: "Billing", href: "/pricing" },
    { icon: ShieldCheck, label: tierLabel, href: "/pricing" },
    { icon: HelpCircle, label: "Live Chat Support", href: "/about" },
  ];

  return (
    <AppShell>
      {/* Container acting as the overlay backdrop (e.g. dimming the rest of the view, though full screen here) */}
      <main className="flex min-h-[calc(100dvh-4rem)] flex-col bg-background/50">
        {/* Spacer to push the menu to the bottom */}
        <div className="flex-1" />

        {/* The bottom-aligned sheet panel */}
        <div className="w-full max-w-3xl mx-auto bg-charcoal rounded-t-[2rem] overflow-hidden shadow-2xl border-t border-border">
          <nav className="flex flex-col py-2" aria-label="More navigation">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.href}
                  className="group flex items-center justify-between px-6 py-4 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-4">
                    <Icon
                      className="size-6 text-muted-foreground group-hover:text-gold transition-colors"
                      strokeWidth={1.5}
                    />
                    <span className="text-lg font-medium text-foreground">{item.label}</span>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground/50 group-hover:text-gold transition-colors" />
                </Link>
              );
            })}

            {/* Logout item */}
            <button
              onClick={handleLogout}
              className="group flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-crimson/10 text-left"
            >
              <div className="flex items-center gap-4">
                <LogOut
                  className="size-6 text-muted-foreground group-hover:text-crimson transition-colors"
                  strokeWidth={1.5}
                />
                <span className="text-lg font-medium text-foreground group-hover:text-crimson transition-colors">
                  Sign Out
                </span>
              </div>
            </button>
          </nav>
        </div>
      </main>
    </AppShell>
  );
}
