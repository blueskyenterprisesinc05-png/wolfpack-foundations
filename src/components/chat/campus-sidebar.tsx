import { ChevronDown, Hash, Trophy, Brain, Megaphone, BookOpen } from "lucide-react";

export function CampusSidebar() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 bg-charcoal">
        <h2 className="font-bold text-foreground truncate">Hustler's Campus</h2>
        <ChevronDown className="size-4 text-muted-foreground shrink-0" />
      </div>
      <div className="flex-1 overflow-y-auto py-4 bg-charcoal">
        <div className="mb-6 px-3">
          <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Community
          </h3>
          <div className="flex flex-col gap-0.5">
            <button className="flex items-center gap-2 rounded-md bg-accent px-2 py-1.5 text-sm font-medium text-gold">
              <Hash className="size-4 shrink-0" />
              <span>General Chat</span>
            </button>
            <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground">
              <Trophy className="size-4 shrink-0" />
              <span>Wins</span>
            </button>
            <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground">
              <Brain className="size-4 shrink-0" />
              <span>Mindset</span>
            </button>
          </div>
        </div>
        <div className="mb-6 px-3">
          <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Resources
          </h3>
          <div className="flex flex-col gap-0.5">
            <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground">
              <Megaphone className="size-4 shrink-0" />
              <span>Announcements</span>
            </button>
            <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground">
              <BookOpen className="size-4 shrink-0" />
              <span>Rules & Guidelines</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
