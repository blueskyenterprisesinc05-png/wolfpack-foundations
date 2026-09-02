import { Link, useLocation } from "@tanstack/react-router";
import {
  LogOut,
  ChevronDown,
  MessageCircle,
  Brain,
  Inbox,
  Briefcase,
  MoreHorizontal,
  Menu,
  Hash,
  Search,
  Users,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

import { BottomNav, isTabActive } from "@/components/brand/bottom-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NestedPathNav } from "@/components/brand/nested-path-nav";

const SIDEBAR_LINKS = [
  { label: "Chat", to: "/chat", icon: MessageCircle },
  { label: "Courses", to: "/courses", icon: Brain },
  { label: "Inbox", to: "/inbox", icon: Inbox },
  { label: "Market", to: "/market", icon: Briefcase },
  { label: "More", to: "/more", icon: MoreHorizontal },
] as const;

/** Returns the TRW-style channel slug shown in the mobile topbar. */
function getChannelName(pathname: string): string {
  if (pathname.startsWith("/chat")) return "chat";
  if (pathname.startsWith("/courses") || pathname.startsWith("/lessons")) return "courses";
  if (pathname.startsWith("/checklist")) return "daily-checklist";
  if (pathname.startsWith("/accountability")) return "accountability-log";
  if (pathname.startsWith("/sessions")) return "sessions-room";
  if (pathname.startsWith("/mindset")) return "mind-lab";
  if (pathname.startsWith("/trading")) return "trading-room";
  if (pathname.startsWith("/community")) return "pack-wins";
  if (pathname.startsWith("/progress")) return "progress";
  if (pathname.startsWith("/inbox")) return "inbox";
  if (pathname.startsWith("/market")) return "market";
  if (pathname.startsWith("/profile")) return "profile";
  if (pathname.startsWith("/settings")) return "settings";
  if (pathname.startsWith("/more")) return "more";
  return "home";
}

function hasPathSwitcher(pathname: string): boolean {
  const pathsWithSwitcher = ["/dashboard", "/courses", "/lessons", "/mindset", "/trading"];
  return pathsWithSwitcher.some((p) => pathname.startsWith(p));
}

/**
 * AppShell — the single member layout owner.
 *
 * Responsibilities:
 * - Renders the desktop sidebar (lg+) and mobile bottom nav (<lg).
 * - Offsets main content so nothing hides behind chrome.
 * - Every authenticated member route must wrap its content with AppShell.
 *
 * MemberShell has been replaced by this component. Do not re-introduce
 * MemberShell or any competing full-height layout wrapper.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const channelName = getChannelName(pathname);

  return (
    <div className="min-h-dvh bg-background">
      {/* Mobile Topbar (<lg) — TRW style: hamburger | # channel-name | search | members */}
      <header className="sticky top-0 z-30 flex h-12 items-center border-b border-border bg-background px-1 gap-1 lg:hidden">
        {/* Hamburger — opens path switcher sheet when relevant */}
        {hasPathSwitcher(pathname) ? (
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-foreground hover:bg-accent cursor-pointer shrink-0"
                aria-label="Open navigation"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-80 bg-charcoal p-5 border-r border-border text-foreground"
            >
              <SheetHeader className="text-left mb-6">
                <SheetTitle className="text-foreground display-lg">My Paths</SheetTitle>
              </SheetHeader>
              <NestedPathNav pathname={pathname} onClose={() => setDrawerOpen(false)} />
            </SheetContent>
          </Sheet>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-foreground hover:bg-accent cursor-pointer shrink-0"
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </Button>
        )}

        {/* Channel hash icon */}
        <Hash className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />

        {/* Channel / page name */}
        <span className="flex-1 text-sm font-semibold text-foreground truncate">
          {channelName}
        </span>

        {/* Search */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent shrink-0"
          aria-label="Search"
        >
          <Search className="size-[18px]" />
        </Button>

        {/* Member list */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent shrink-0"
          aria-label="Member list"
        >
          <Users className="size-[18px]" />
        </Button>
      </header>

      {/* ── Desktop sidebar (lg+) ──────────────────────────────────── */}
      <aside
        className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-charcoal lg:flex"
        aria-label="Sidebar navigation"
      >
        {/* Campus header */}
        <div className="shrink-0 flex items-center justify-between px-4 py-4 border-b border-border">
          <span className="text-sm font-bold text-foreground">The 1% Club</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>

        {/* Primary nav links */}
        <nav
          className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3"
          aria-label="Main navigation"
        >
          {SIDEBAR_LINKS.map(({ label, to, icon: Icon }) => {
            const active = isTabActive(to, pathname);
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold motion-base",
                  active
                    ? "bg-accent text-gold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-border p-3">
          <Link
            to="/login"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground motion-base"
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            Log out
          </Link>
        </div>
      </aside>

      {/* Main content area
          pt-12: clears 48px mobile topbar.
          pb-16: clears 64px mobile bottom nav.
          lg:pt-0 lg:pb-0: no offset needed on desktop.
          lg:pl-64: pushes content clear of the fixed sidebar.
      */}
      <main className="lg:pl-64 pt-12 lg:pt-0 pb-16 lg:pb-0">{children}</main>

      {/* ── Mobile bottom nav (<lg) ────────────────────────────────── */}
      <BottomNav />
    </div>
  );
}

