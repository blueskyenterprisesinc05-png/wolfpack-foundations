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
  ArrowLeft,
  Pencil,
  AtSign,
  Mail,
  Phone,
  Key,
  List
} from "lucide-react";
import { signOutFn } from "@/lib/auth";
import { useRouteContext } from "@tanstack/react-router";

export function SettingsPage() {
  const router = useRouter();
  
  const handleLogout = async () => {
    await signOutFn();
    router.invalidate();
  };

  return (
    <div className="min-h-screen bg-obsidian relative pb-24">
      <main className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-4 bg-obsidian border-b border-border/50 sticky top-0 z-10">
          <Link to="/" className="text-foreground hover:text-gold transition-colors">
            <ArrowLeft className="size-6" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">My Account</h1>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* JOIN THE COUNCIL Block */}
          <div className="border border-gold rounded-xl overflow-hidden bg-charcoal/30">
            <div className="p-4 flex items-center justify-between border-b border-border/20 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="size-8 overflow-hidden rounded-md bg-white/10 flex items-center justify-center">
                  <img src="https://api.dicebear.com/7.x/shapes/svg?seed=council" alt="Council" className="size-6 opacity-80" />
                </div>
                <h2 className="text-xl font-bold text-foreground group-hover:text-gold transition-colors">JOIN THE COUNCIL</h2>
              </div>
              <ChevronRight className="size-6 text-foreground group-hover:text-gold transition-colors" />
            </div>
            <div className="p-4 space-y-2">
              {[
                "Add friends within THE COUNCIL",
                "Communicate with the best of THE REAL WORLD.",
                "Experience the inner workings of a world-class team.",
                "Join your Professors in changing lives for the better."
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2">
                  <svg className="size-5 text-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-foreground/90">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Header */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="size-16 rounded-full bg-gradient-to-tr from-secondary to-accent border-2 border-border overflow-hidden">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=wolf"
                    alt="Avatar"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-charcoal rounded-full p-1 border border-border">
                  <Crown className="size-4 text-gold" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">@wolf billion</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="size-3 rounded-full border border-muted-foreground flex items-center justify-center text-[8px]">i</span>
                  01KP9W3CBMFGCJ5XYQQF2FSTV1
                </span>
              </div>
            </div>
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <Pencil className="size-5 text-foreground" />
            </button>
          </div>

          {/* Account Information Section */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3 px-1">Account Information</h3>
            <div className="border border-gold rounded-xl overflow-hidden bg-charcoal/30 flex flex-col divide-y divide-gold/20">
              
              {/* Username */}
              <div className="flex items-center justify-between p-4 group">
                <div className="flex items-center gap-4">
                  <AtSign className="size-6 text-foreground group-hover:text-gold transition-colors" strokeWidth={1.5} />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Username</span>
                    <span className="text-base text-foreground">wolf billion</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <Pencil className="size-5 text-foreground" />
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-4 group">
                <div className="flex items-center gap-4">
                  <Mail className="size-6 text-foreground group-hover:text-gold transition-colors" strokeWidth={1.5} />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Email Address (Unverified)</span>
                    <span className="text-base text-foreground">destinyokpare66@gmail.com</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <Pencil className="size-5 text-foreground" />
                </button>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between p-4 group">
                <div className="flex items-center gap-4">
                  <Phone className="size-6 text-foreground group-hover:text-gold transition-colors" strokeWidth={1.5} />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Phone Number</span>
                    <span className="text-base text-muted-foreground">Not Set</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <Pencil className="size-5 text-foreground" />
                </button>
              </div>

              {/* Password */}
              <div className="flex items-center justify-between p-4 group">
                <div className="flex items-center gap-4">
                  <Key className="size-6 text-foreground group-hover:text-gold transition-colors" strokeWidth={1.5} />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Password</span>
                    <span className="text-base text-foreground tracking-[0.2em] font-bold mt-1">.........</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <Pencil className="size-5 text-foreground" />
                </button>
              </div>

            </div>
          </div>

          {/* Two-factor Authentication Section */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1 px-1">Two-factor Authentication</h3>
            <p className="text-sm text-foreground/80 mb-3 px-1">Add an extra layer of security by enabling 2FA on your account.</p>
            
            <div className="bg-crimson text-white p-3 rounded-lg mb-3">
              Failed to fetch (eden.therealworld.ag)
            </div>

            <div className="border border-gold rounded-xl overflow-hidden bg-charcoal/30 flex flex-col divide-y divide-border/50">
              
              {/* Backup Codes */}
              <div className="flex items-center gap-4 p-4 group hover:bg-secondary/30 transition-colors cursor-pointer">
                <List className="size-6 text-muted-foreground group-hover:text-gold transition-colors" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-muted-foreground tracking-wide uppercase">Generate Backup Codes</span>
                  <span className="text-sm text-muted-foreground">Get ready to use 2FA by setting a backup method.</span>
                </div>
              </div>

              {/* Add Authenticator */}
              <div className="flex items-center gap-4 p-4 group hover:bg-secondary/30 transition-colors cursor-pointer">
                <Lock className="size-6 text-muted-foreground group-hover:text-gold transition-colors" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-muted-foreground tracking-wide uppercase">Add Authenticator</span>
                  <span className="text-sm text-muted-foreground">Set up time-based one-time password (TOTP).</span>
                </div>
              </div>

            </div>
          </div>

          {/* Customize Profile Link */}
          <div className="bg-charcoal/50 rounded-xl p-4 flex items-center justify-between border border-border/30">
            <span className="text-foreground text-sm font-medium">Looking to customize your profile?</span>
            <Link to="/profile" className="text-gold hover:text-gold-tint transition-colors text-sm font-medium">Head to your profile settings.</Link>
          </div>

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
