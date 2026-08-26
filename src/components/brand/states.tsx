import type { ReactNode } from "react";
import { Inbox, RotateCcw, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-xl border border-dashed border-border bg-charcoal/60 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-secondary text-muted-foreground">
        {icon ?? <Inbox className="size-5" />}
      </div>
      <h3 className="font-body text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "Couldn't load this",
  description = "Something broke on our side. Try again in a moment.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-xl border border-crimson/35 bg-crimson/8 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-crimson/15 text-crimson-tint">
        <TriangleAlert className="size-5" />
      </div>
      <h3 className="font-body text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          <RotateCcw /> Try again
        </Button>
      ) : null}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <Card variant="bordered">
      <CardContent className="space-y-3 p-5">
        <Skeleton className="h-4 w-2/3 bg-border" />
        <Skeleton className="h-3 w-full bg-border" />
        <Skeleton className="h-3 w-4/5 bg-border" />
        <Skeleton className="h-1.5 w-full bg-border" />
      </CardContent>
    </Card>
  );
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg border border-border bg-charcoal p-4"
        >
          <Skeleton className="h-9 w-9 shrink-0 rounded-md bg-border" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/2 bg-border" />
            <Skeleton className="h-3 w-1/4 bg-border" />
          </div>
        </div>
      ))}
    </div>
  );
}
