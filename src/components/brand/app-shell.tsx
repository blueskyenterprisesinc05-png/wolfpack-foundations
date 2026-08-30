import { Link, useLocation } from "@tanstack/react-router";
import {
  BookOpen,
  Home,
  LogOut,
  ChevronDown,
  MessageCircle,
  Brain,
  Inbox,
  Briefcase,
  MoreVertical,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { BottomNav, isTabActive } from "@/components/brand/bottom-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NestedPathNav } from "@/components/brand/nested-path-nav";

const SIDEBAR_LINKS = [
  { label: "Chat", to: "/chat", icon: MessageCircle },
  { label: "Courses", to: "/courses", icon: Brain },
  { label: "Inbox", to: "/inbox", icon: Inbox },
  { label: "Market", to: "/market", icon: Briefcase },
  { label: "More", to: "/more", icon: MoreVertical },
] as const;

function getHeaderTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Den";
  if (pathname.startsWith("/courses") || pathname.startsWith("/lessons")) {
    if (pathname.includes("mind-lab")) return "Mind Lab";
    if (pathname.includes("trading-room")) return "Trading Room";
    return "Learning";
  }
  if (pathname.startsWith("/community")) return "Pack";
  if (pathname.startsWith("/progress")) return "Progress";
  if (pathname.startsWith("/more")) return "More";
  if (pathname.startsWith("/mindset")) return "Mind Lab";
  if (pathname.startsWith("/trading")) return "Trading Room";
  if (pathname.startsWith("/checklist")) return "Checklist";
  if (pathname.startsWith("/accountability")) return "Accountability";
  if (pathname.startsWith("/sessions")) return "Sessions";
  if (pathname.startsWith("/profile")) return "Profile";
  if (pathname.startsWith("/settings")) return "Settings";
  return "";
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

  return (
    <div className="min-h-dvh bg-background">
      {/* ── Mobile Contextual Header (<lg) ────────────────────────── */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur lg:hidden">
        <Logo size="sm" />

        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold">{getHeaderTitle(pathname)}</span>
          {hasPathSwitcher(pathname) && (
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Switch paths"
                >
                  <ChevronDown className="size-4" />
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
          )}
        </div>

        {/* Optional utility slot */}
        <div className="w-8" aria-hidden="true" />
      </header>

      {/* ── Desktop sidebar (lg+) ──────────────────────────────────── */}
      <aside
        className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-charcoal lg:flex"
        aria-label="Sidebar navigation"
      >
        {/* Logo */}
        <div className="shrink-0 px-5 py-6">
          <Logo size="sm" />
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

      {/* ── Main content area ──────────────────────────────────────── */}
      {/*
        pt-14: offsets contextual mobile header.
        pb-16: clears the mobile bottom nav bar (64px).
        lg:pt-0 lg:pb-0: no padding adjustments needed on desktop.
        lg:pl-64: pushes content clear of the fixed sidebar.
      */}
      <main className="lg:pl-64 pt-14 lg:pt-0 pb-16 lg:pb-0">{children}</main>

      {/* ── Mobile bottom nav (<lg) ────────────────────────────────── */}
      <BottomNav />
    </div>
  );
}
