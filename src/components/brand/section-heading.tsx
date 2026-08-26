import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Display face (Bebas) is allowed here only: h1/h2, hero text, section headers,
 * large numeric stats. Keep the text 2–4 words, uppercase.
 */
export function SectionHeading({
  children,
  eyebrow,
  action,
  className,
}: {
  children: ReactNode;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-border pb-3 sm:flex sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
        <h2 className="display-lg text-foreground">{children}</h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Stat({
  value,
  label,
  tone = "default",
}: {
  value: ReactNode;
  label: string;
  tone?: "default" | "gold" | "forest" | "crimson";
}) {
  const toneClass = {
    default: "text-foreground",
    gold: "text-gold",
    forest: "text-forest",
    crimson: "text-crimson-tint",
  }[tone];

  return (
    <div>
      <div className={cn("display-stat", toneClass)}>{value}</div>
      <p className="eyebrow mt-1">{label}</p>
    </div>
  );
}
