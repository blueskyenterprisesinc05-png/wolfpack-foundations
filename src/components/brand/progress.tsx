import { Flame, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export type ProgressTone = "gold" | "forest" | "crimson" | "neutral";

const fillTone: Record<ProgressTone, string> = {
  gold: "bg-gold",
  forest: "bg-forest",
  crimson: "bg-crimson",
  neutral: "bg-muted-foreground",
};

/** Colour map (locked): active = gold, completed = forest, broken = crimson. */
export function ProgressBar({
  value,
  tone = "gold",
  label,
  showValue = true,
  className,
}: {
  value: number;
  tone?: ProgressTone;
  label?: string;
  showValue?: boolean;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("w-full", className)}>
      {label || showValue ? (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          {label ? <span className="eyebrow">{label}</span> : <span />}
          {showValue ? (
            <span className="font-body text-xs font-semibold tabular-nums text-muted-foreground">
              {Math.round(pct)}%
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
        className="h-1.5 w-full overflow-hidden rounded-full bg-border"
      >
        <div
          className={cn("h-full rounded-full", fillTone[tone])}
          style={{
            width: `${pct}%`,
            transition: "width var(--motion-slow) var(--ease-out)",
          }}
        />
      </div>
    </div>
  );
}

export function ProgressCircle({
  value,
  size = 96,
  tone = "gold",
  caption,
}: {
  value: number;
  size?: number;
  tone?: ProgressTone;
  caption?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const strokeTone: Record<ProgressTone, string> = {
    gold: "stroke-gold",
    forest: "stroke-forest",
    crimson: "stroke-crimson",
    neutral: "stroke-muted-foreground",
  };

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            className="stroke-border"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c - (c * pct) / 100}
            className={strokeTone[tone]}
            style={{ transition: "stroke-dashoffset var(--motion-slow) var(--ease-out)" }}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-display text-2xl tabular-nums text-foreground">
          {Math.round(pct)}
        </span>
      </div>
      {caption ? <p className="eyebrow">{caption}</p> : null}
    </div>
  );
}

export function StreakCard({
  days,
  bestDays,
  broken = false,
}: {
  days: number;
  bestDays: number;
  broken?: boolean;
}) {
  return (
    <Card variant={broken ? "crimson" : "gold"}>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "grid h-12 w-12 shrink-0 place-items-center rounded-lg",
            broken ? "bg-crimson/15 text-crimson-tint" : "bg-gold/15 text-gold",
          )}
        >
          <Flame className="size-6" />
        </div>
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span
              className={cn("display-stat text-3xl", broken ? "text-crimson-tint" : "text-gold")}
            >
              {days}
            </span>
            <span className="font-body text-sm text-muted-foreground">day streak</span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {broken ? "Streak broken — start again today." : `Personal best ${bestDays} days`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ConsistencyMeter({ pct, weeks = 12 }: { pct: number; weeks?: number }) {
  const filled = Math.round((pct / 100) * weeks);
  return (
    <Card variant="bordered">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow">Consistency</span>
          <span className="inline-flex items-center gap-1 font-body text-xs font-semibold text-forest">
            <TrendingUp className="size-3.5" /> {pct}%
          </span>
        </div>
        <div className="mt-3 flex gap-1">
          {Array.from({ length: weeks }).map((_, i) => (
            <span
              key={i}
              className={cn("h-7 flex-1 rounded-sm", i < filled ? "bg-forest/80" : "bg-border/70")}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Last {weeks} weeks of completed check-ins.
        </p>
      </CardContent>
    </Card>
  );
}
