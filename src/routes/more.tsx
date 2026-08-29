import { createFileRoute, redirect, Link, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/brand/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Settings, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Bell
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

  const menuSections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile", href: "/profile" },
        { icon: Settings, label: "Settings", href: "/settings" },
        { icon: Bell, label: "Notifications", href: "/settings/notifications" },
      ]
    },
    {
      title: "Membership",
      items: [
        { icon: CreditCard, label: "Billing & Subscription", href: "/pricing" },
        { icon: ShieldCheck, label: "Membership Tier", href: "/pricing" },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", href: "/about" },
      ]
    }
  ];

  return (
    <AppShell>
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <header className="border-b border-border pb-6">
            <h1 className="display-xl text-foreground">More</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage your account, settings, and membership.
            </p>
          </header>

          <div className="flex flex-col gap-8">
            {/* User Profile Summary */}
            <Card variant="bordered" className="overflow-hidden">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="grid size-14 shrink-0 place-items-center rounded-full bg-secondary font-display text-2xl text-gold">
                  {profile?.initials ?? "M"}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-lg">{profile?.name ?? "Member"}</p>
                  <p className="text-sm text-muted-foreground">{profile?.handle ?? "Member account"}</p>
                </div>
                <Link to="/profile" className="rounded-full border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent hover:text-gold transition-colors">
                  View Profile
                </Link>
              </CardContent>
            </Card>

            {/* Navigation Menus */}
            {menuSections.map((section, idx) => (
              <div key={idx}>
                <p className="eyebrow mb-3 text-muted-foreground">{section.title}</p>
                <Card variant="bordered" className="overflow-hidden">
                  <div className="flex flex-col divide-y divide-border">
                    {section.items.map((item, itemIdx) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={itemIdx}
                          to={item.href}
                          className="group flex items-center justify-between p-4 transition-colors hover:bg-secondary/50"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="size-5 text-muted-foreground group-hover:text-gold transition-colors" />
                            <span className="font-medium text-foreground">{item.label}</span>
                          </div>
                          <ChevronRight className="size-4 text-muted-foreground group-hover:text-gold transition-colors" />
                        </Link>
                      );
                    })}
                  </div>
                </Card>
              </div>
            ))}

            {/* Logout */}
            <div className="mt-4">
              <button
                onClick={handleLogout}
                className="group flex w-full items-center justify-between rounded-xl border border-border bg-charcoal p-4 transition-colors hover:border-crimson/40 hover:bg-crimson/5 text-left"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="size-5 text-crimson group-hover:text-crimson-tint transition-colors" />
                  <span className="font-medium text-crimson group-hover:text-crimson-tint">Sign Out</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
