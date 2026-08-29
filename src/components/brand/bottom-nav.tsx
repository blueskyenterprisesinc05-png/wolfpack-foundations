import { Link, useLocation } from "@tanstack/react-router";
import { BarChart2, BookOpen, Home, MoreHorizontal, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Den", to: "/dashboard", icon: Home },
  { label: "Learning", to: "/courses", icon: BookOpen },
  { label: "Pack", to: "/community", icon: Users },
  { label: "Progress", to: "/progress", icon: BarChart2 },
  { label: "More", to: "/more", icon: MoreHorizontal },
] as const;

/**
 * Maps a bottom-nav tab's `to` value to the set of route prefixes it owns.
 * A tab is active when the current pathname matches any of its owned prefixes.
 */
export function isTabActive(tabTo: string, pathname: string): boolean {
  switch (tabTo) {
    case "/dashboard":
      return pathname === "/dashboard";
    case "/courses":
      return pathname.startsWith("/courses") || pathname.startsWith("/lessons");
    case "/community":
      return pathname.startsWith("/community");
    case "/progress":
      return (
        pathname.startsWith("/progress") ||
        pathname.startsWith("/accountability") ||
        pathname.startsWith("/sessions")
      );
    case "/more":
      return (
        pathname.startsWith("/more") ||
        pathname.startsWith("/profile") ||
        pathname.startsWith("/settings") ||
        pathname.startsWith("/checklist")
      );
    default:
      return false;
  }
}

/**
 * Mobile-only bottom navigation bar.
 * Hidden on lg+ (desktop sidebar takes over).
 * Fixed to the viewport bottom; safe-area-inset aware.
 */
export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t border-border bg-charcoal lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {TABS.map(({ label, to, icon: Icon }) => {
        const active = isTabActive(to, pathname);
        return (
          <Link
            key={to}
            to={to}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-[3px] pt-1 text-[10px] font-semibold uppercase tracking-widest motion-base select-none",
              active ? "text-gold" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {/* Active indicator: thin gold rule at tab top */}
            {active && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 mx-auto h-0.5 w-10 rounded-full bg-gold"
              />
            )}
            <Icon className="size-5 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
