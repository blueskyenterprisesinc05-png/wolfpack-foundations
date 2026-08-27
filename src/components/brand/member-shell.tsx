import { Link, useLocation } from "@tanstack/react-router";
import { Home, Brain, CandlestickChart, BookOpen, LogOut, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const links = [
  { label: "The Den", to: "/dashboard", icon: Home },
  { label: "Mind Lab", to: "/mindset", icon: Brain },
  { label: "Trading Room", to: "/trading", icon: CandlestickChart },
];
export function MemberShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-charcoal p-5 lg:flex lg:flex-col">
        <Logo size="sm" />
        <p className="eyebrow mt-12 text-gold">Member space</p>
        <nav className="mt-5 flex flex-col gap-1">
          {links.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                location.pathname === to && "bg-accent text-gold",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
          <Link
            to="/styleguide"
            className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <BookOpen className="size-4" />
            Styleguide
          </Link>
          <Link
            to="/"
            className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <LogOut className="size-4" />
            Logout placeholder
          </Link>
        </div>
      </aside>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/90 px-4 py-4 backdrop-blur lg:hidden">
        <Logo size="sm" />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open member navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </header>
      {open && (
        <nav className="flex flex-col gap-1 border-b border-border bg-charcoal p-4 lg:hidden">
          {links.map(({ label, to, icon: Icon }) => (
            <Link
              onClick={() => setOpen(false)}
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
      )}
      <main className="lg:pl-64">{children}</main>
    </div>
  );
}
