import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import {
  User,
  Bell,
  UserCircle,
  MonitorSmartphone,
  Crown,
  BarChart2,
  Share2,
  Sliders,
  MessageSquare,
  Sparkles,
  LogOut,
  Lock,
  ChevronRight,
  MessageCircleQuestion,
} from "lucide-react";
import { signOutFn } from "@/lib/auth";
import { useRouteContext } from "@tanstack/react-router";

export function SettingsPage() {
  const router = useRouter();
  // Using profile from route context if available, otherwise fallback
  // In a real app we'd get this from a hook, assuming context.user is available
  const handleLogout = async () => {
    await signOutFn();
    router.invalidate();
  };

  const settingsLinks = [
    { label: "My Account", icon: User, href: "#" },
    { label: "Notifications", icon: Bell, href: "/settings/notifications" },
    { label: "Profile", icon: UserCircle, href: "/profile" },
    { label: "Connected Devices", icon: MonitorSmartphone, href: "#" },
    { label: "My Membership", icon: Crown, href: "/pricing" },
    { label: "Affiliate Dashboard", icon: BarChart2, href: "#" },
    { label: "Refer a Friend", icon: Share2, href: "#" },
    { label: "Advanced", icon: Sliders, href: "#" },
    { label: "Provide Feedback", icon: MessageSquare, href: "/about" },
    { label: "What's New", icon: Sparkles, href: "#" },
  ];

  return (
    <div className="min-h-screen bg-background relative pb-24">
      {/* Spacer for mobile header if needed, though AppShell handles some of this */}
      <main className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
        {/* Profile Header Block */}
        <div className="bg-charcoal/80 rounded-2xl p-4 flex items-center gap-4 mb-8">
          <div className="relative">
            {/* Avatar Placeholder */}
            <div className="size-16 rounded-full bg-gradient-to-tr from-secondary to-accent border-2 border-border overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=wolf"
                alt="Avatar"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            {/* Crown Badge */}
            <div className="absolute -bottom-1 -right-1 bg-charcoal rounded-full p-1 border border-border">
              <Crown className="size-4 text-gold" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Welcome,</span>
            <span className="text-xl font-bold text-foreground">wolf billion</span>
          </div>
        </div>

        {/* Settings Title */}
        <h1 className="text-2xl font-bold text-foreground mb-4 px-1">Settings</h1>

        {/* Settings Links List */}
        <div className="border border-border rounded-xl overflow-hidden bg-charcoal/30 mb-8">
          <nav className="flex flex-col divide-y divide-border/50">
            {settingsLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.href}
                  className="group flex items-center justify-between p-4 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-4">
                    <Icon
                      className="size-5 text-foreground group-hover:text-gold transition-colors"
                      strokeWidth={1.75}
                    />
                    <span className="font-medium text-foreground text-[15px]">{item.label}</span>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground group-hover:text-gold transition-colors" />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Actions */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-4 rounded-xl border border-crimson/40 bg-crimson/5 hover:bg-crimson/10 transition-colors"
          >
            <LogOut className="size-5 text-crimson" strokeWidth={2} />
            <span className="font-medium text-crimson">Logout</span>
          </button>

          <button className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-secondary/50 transition-colors">
            <Lock className="size-5 text-muted-foreground" strokeWidth={2} />
            <span className="font-medium text-muted-foreground">Logout All Devices</span>
          </button>
        </div>
      </main>

      {/* Floating Action Button (Support) */}
      <button
        className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 size-14 rounded-full bg-gold flex items-center justify-center shadow-lg hover:bg-gold-tint transition-colors z-50"
        aria-label="Support Chat"
      >
        <MessageCircleQuestion className="size-6 text-black fill-black" />
      </button>
    </div>
  );
}
