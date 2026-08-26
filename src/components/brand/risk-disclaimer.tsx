import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Single source of the honest-trading language. Reused in the Trading Room,
 * pricing and landing so the wording never drifts.
 */
export function RiskDisclaimer({
  variant = "block",
  className,
}: {
  variant?: "block" | "inline";
  className?: string;
}) {
  const body =
    "Trading involves substantial risk of loss. Nothing here is financial advice, a signal service, or a promise of profit. The 1% Club teaches process and discipline — results depend entirely on you.";

  if (variant === "inline") {
    return (
      <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>{body}</p>
    );
  }

  return (
    <aside
      className={cn(
        "flex gap-3 rounded-lg border border-crimson/35 bg-crimson/8 p-4",
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-crimson-tint" aria-hidden />
      <div className="min-w-0">
        <p className="font-body text-sm font-semibold text-crimson-tint">Risk disclaimer</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </aside>
  );
}
