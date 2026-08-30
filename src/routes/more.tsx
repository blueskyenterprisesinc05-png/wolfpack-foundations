import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/brand/app-shell";
import {
  Settings,
  User,
  ListTodo,
  Wallet,
  Crown,
  Users,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/more")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: MorePage,
});

function MorePage() {
  const menuItems = [
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: ListTodo, label: "Checklist", href: "#" },
    { icon: Wallet, label: "Wallet", href: "#" },
    { icon: Crown, label: "Queen", href: "#" },
    { icon: Users, label: "Friends", href: "#" },
    { icon: HelpCircle, label: "Live Chat Support", href: "/about" },
  ];

  return (
    <AppShell>
      {/* Dimmed backdrop covering the whole screen above the bottom nav */}
      <main className="flex min-h-[calc(100dvh-4rem)] flex-col bg-background/80 backdrop-blur-sm">
        <div className="flex-1" />

        {/* Bottom-aligned panel */}
        <div className="w-full max-w-3xl mx-auto bg-[#1a1f2c] rounded-t-2xl overflow-hidden shadow-2xl">
          <nav className="flex flex-col py-2" aria-label="More navigation">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.href}
                  className="group flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <Icon className="size-5 text-gray-300" strokeWidth={1.75} />
                    <span className="text-[15px] text-gray-100">{item.label}</span>
                  </div>
                  <ChevronRight className="size-4 text-gray-500" />
                </Link>
              );
            })}
          </nav>
        </div>
      </main>
    </AppShell>
  );
}
