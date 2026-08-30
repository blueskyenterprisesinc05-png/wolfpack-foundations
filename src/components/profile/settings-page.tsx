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

export function SettingsPage({ user, profile }: { user: any; profile: any }) {
  const router = useRouter();
  
  const handleLogout = async () => {
    await signOutFn();
    router.invalidate();
  };

  const username = profile?.username || "wolf billion";
  const avatarUrl = profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + username;

  const settingsLinks = [
    { label: "My Account", icon: User, href: "/settings/account" }, // Assuming a sub-route exists or will exist
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
    <div className="min-h-screen bg-obsidian relative pb-24">
      <main className="mx-auto max-w-3xl pt-6">
        
        <div className="px-4 sm:px-6 mb-6">
          {/* Profile Header Block */}
          <div className="bg-charcoal rounded-2xl p-4 flex items-center gap-4">
            <div className="relative shrink-0">
              {/* Avatar */}
              <div className="size-16 rounded-full bg-gradient-to-tr from-secondary to-accent border-2 border-border overflow-hidden">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              {/* Crown Badge */}
              <div className="absolute -bottom-1 -right-1 bg-charcoal rounded-full p-1 border border-border">
                <Crown className="size-4 text-gold" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Welcome,</span>
              <span className="text-xl font-bold text-foreground truncate">{username}</span>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6">
          {/* Settings Title */}
          <h1 className="text-2xl font-bold text-foreground mb-4">Settings</h1>

          {/* Settings Links List */}
          <div className="border border-gold rounded-xl overflow-hidden bg-obsidian mb-8 shadow-sm">
            <nav className="flex flex-col">
              {settingsLinks.map((item, idx) => {
                const Icon = item.icon;
                const isLast = idx === settingsLinks.length - 1;
                return (
                  <Link
                    key={idx}
                    to={item.href}
                    className={`group flex items-center justify-between p-4 transition-colors hover:bg-secondary/30 ${!isLast ? 'border-b border-border/30' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon
                        className="size-6 text-foreground group-hover:text-gold transition-colors"
                        strokeWidth={1.5}
                      />
                      <span className="font-medium text-foreground text-[16px]">{item.label}</span>
                    </div>
                    <ChevronRight className="size-5 text-muted-foreground group-hover:text-gold transition-colors" />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section with Topo Background simulation */}
        <div className="px-4 sm:px-6 pt-6 pb-8 bg-charcoal/20 border-t border-border/20 rounded-t-[2.5rem] relative overflow-hidden">
          {/* Decorative faint background wave/topo effect could go here */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 100%, var(--color-gold) 0%, transparent 50%)' }}></div>
          
          <div className="flex flex-col gap-4 relative z-10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full p-4 rounded-xl border border-crimson/60 bg-transparent hover:bg-crimson/10 transition-colors focus:ring-2 focus:ring-crimson/50 outline-none"
            >
              <LogOut className="size-6 text-crimson" strokeWidth={1.5} />
              <span className="font-medium text-crimson text-lg">Logout</span>
            </button>

            <button className="flex items-center gap-4 w-full p-4 rounded-xl hover:bg-secondary/30 transition-colors focus:ring-2 focus:ring-gold/50 outline-none">
              <Lock className="size-6 text-foreground/80" strokeWidth={1.5} />
              <span className="font-medium text-foreground/80 text-lg">Logout All Devices</span>
            </button>
          </div>
        </div>

      </main>

      {/* Floating Action Button (Support) */}
      <button
        className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 size-14 rounded-full bg-gold flex items-center justify-center shadow-lg hover:bg-gold-tint hover:scale-105 active:scale-95 transition-all z-50 focus:ring-4 focus:ring-gold/30 outline-none"
        aria-label="Support Chat"
      >
        <MessageCircleQuestion className="size-6 text-black fill-black" />
      </button>
    </div>
  );
}
