import { Link } from "@tanstack/react-router";
import { Brain, CandlestickChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface NestedPathNavProps {
  pathname: string;
  onClose: () => void;
}

export function NestedPathNav({ pathname, onClose }: NestedPathNavProps) {
  const isMindLabActive = pathname.startsWith("/mindset") || pathname.includes("mind-lab");
  const isTradingRoomActive = pathname.startsWith("/trading") || pathname.includes("trading-room");

  return (
    <nav className="flex flex-col gap-6" aria-label="Path navigation">
      <div className="flex flex-col gap-1">
        <p className="eyebrow px-2 mb-2">My Paths</p>

        {/* Mind Lab */}
        <div className="flex flex-col gap-1">
          <Link
            to="/mindset"
            onClick={onClose}
            className={cn(
              "flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold motion-base",
              isMindLabActive
                ? "bg-accent text-gold"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-3">
              <Brain className="size-4 shrink-0" />
              Mind Lab
            </span>
            {isMindLabActive && (
              <span className="text-[10px] bg-gold/10 text-gold px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                Active
              </span>
            )}
          </Link>

          {isMindLabActive && (
            <div className="pl-6 pr-2 py-2 flex flex-col gap-2 border-l border-border/50 ml-5 mt-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                Fundamentals
              </p>
              <Link
                to="/lessons/$lessonId"
                params={{ lessonId: "ml1" }}
                onClick={onClose}
                className="flex items-center gap-2 text-xs text-gold hover:opacity-90 py-1 motion-base"
              >
                <Brain className="size-4 text-gold shrink-0" /> The Mind Is the First Market
              </Link>
              <Link
                to="/lessons/$lessonId"
                params={{ lessonId: "ml2" }}
                onClick={onClose}
                className="flex items-center gap-2 text-xs text-gold hover:opacity-90 py-1 motion-base"
              >
                <Flame className="size-4 text-gold shrink-0" /> Emotional Triggers
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/50 py-1 cursor-not-allowed select-none">
                <Flame className="size-4 shrink-0" /> Motivation Fades
              </div>

              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-3 mb-1">
                Your Practice
              </p>
              <Link
                to="/checklist"
                onClick={onClose}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground py-1 motion-base"
              >
                <CheckSquare className="size-4 shrink-0" /> Daily Check-in
              </Link>
              <Link
                to="/community"
                onClick={onClose}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground py-1 motion-base"
              >
                <Users className="size-4 shrink-0" /> Pack Wins
              </Link>
            </div>
          )}
        </div>

        {/* Trading Room */}
        <div className="flex flex-col gap-1 mt-2">
          <Link
            to="/trading"
            onClick={onClose}
            className={cn(
              "flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold motion-base",
              isTradingRoomActive
                ? "bg-accent text-gold"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-3">
              <CandlestickChart className="size-4 shrink-0" />
              Trading Room
            </span>
            {isTradingRoomActive && (
              <span className="text-[10px] bg-gold/10 text-gold px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                Active
              </span>
            )}
          </Link>

          {isTradingRoomActive && (
            <div className="pl-6 pr-2 py-2 flex flex-col gap-2 border-l border-border/50 ml-5 mt-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                Fundamentals
              </p>
              <Link
                to="/lessons/$lessonId"
                params={{ lessonId: "tr1" }}
                onClick={onClose}
                className="flex items-center gap-2 text-xs text-gold hover:opacity-90 py-1 motion-base"
              >
                <Brain className="size-4 text-gold shrink-0" /> Emotions Are Part of the Trade
              </Link>
              <Link
                to="/lessons/$lessonId"
                params={{ lessonId: "tr2" }}
                onClick={onClose}
                className="flex items-center gap-2 text-xs text-gold hover:opacity-90 py-1 motion-base"
              >
                <CandlestickChart className="size-4 text-gold shrink-0" /> Risk Before Reward
              </Link>
              <Link
                to="/lessons/$lessonId"
                params={{ lessonId: "tr3" }}
                onClick={onClose}
                className="flex items-center gap-2 text-xs text-gold hover:opacity-90 py-1 motion-base"
              >
                <CalendarCheck className="size-4 text-gold shrink-0" /> Building a Plan
              </Link>

              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-3 mb-1">
                Your Practice
              </p>
              <Link
                to="/accountability"
                onClick={onClose}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground py-1 motion-base"
              >
                <ClipboardList className="size-4 shrink-0" /> Accountability Log
              </Link>
              <Link
                to="/sessions"
                onClick={onClose}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground py-1 motion-base"
              >
                <Video className="size-4 shrink-0" /> Sessions Room
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
