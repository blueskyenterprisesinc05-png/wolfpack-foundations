import type { ReactNode } from "react";
import { BarChart3, BookOpen, Home, Menu, Trophy, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export interface NavItem {
  label: string;
  icon: typeof Home;
  active?: boolean;
}

export const demoNav: NavItem[] = [
  { label: "The Den", icon: Home, active: true },
  { label: "Courses", icon: BookOpen },
  { label: "Progress", icon: BarChart3 },
  { label: "Marks", icon: Trophy },
];

/** Desktop top bar — body face only, minimal. */
export function TopBar({ action }: { action?: ReactNode }) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border bg-charcoal/80 px-4 py-3 backdrop-blur sm:flex sm:justify-between sm:px-6">
      <Logo size="sm" />
      <nav className="hidden items-center gap-1 md:flex">
        {demoNav.map((item) => (
          <button
            key={item.label}
            className={cn(
              "motion-base rounded-md px-3 py-2 font-body text-sm font-medium",
              item.active
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="flex shrink-0 items-center gap-2">
        {action}
        <Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden">
          <Menu />
        </Button>
      </div>
    </header>
  );
}

export function MemberSidebar({ items = demoNav }: { items?: NavItem[] }) {
  return (
    <aside className="w-full max-w-60 shrink-0 rounded-xl border border-border bg-sidebar p-3">
      <div className="px-2 pb-3">
        <Logo size="sm" />
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={cn(
                "motion-base flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 font-body text-sm font-medium",
                item.active
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export function MobileBottomNav({ items = demoNav }: { items?: NavItem[] }) {
  const all: NavItem[] = [...items.slice(0, 4), { label: "You", icon: User }];
  return (
    <nav className="flex items-stretch gap-1 rounded-xl border border-border bg-charcoal p-1.5">
      {all.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            className={cn(
              "motion-base flex min-h-11 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5",
              item.active ? "bg-secondary text-gold" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            <span className="font-body text-[0.625rem] font-semibold uppercase tracking-wide">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
