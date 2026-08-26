import { CheckCircle2, CircleDot, Lock, Play, Target } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/brand/progress";
import type { Course, Goal, Lesson, Mark } from "@/types";

export function CourseCard({ course, onOpen }: { course: Course; onOpen?: () => void }) {
  const pct = (course.lessonsComplete / course.lessonCount) * 100;
  const locked = course.tier === "inner-circle" && course.lessonsComplete === 0;

  return (
    <Card variant="bordered" interactive onClick={onOpen} className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow">{course.level}</span>
          {locked ? (
            <Badge variant="outline" className="border-gold/40 text-gold">
              <Lock className="mr-1 size-3" /> Inner circle
            </Badge>
          ) : null}
        </div>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ProgressBar
          value={pct}
          tone={pct >= 100 ? "forest" : pct > 0 ? "gold" : "neutral"}
          label={`${course.lessonsComplete}/${course.lessonCount} lessons`}
        />
      </CardContent>
    </Card>
  );
}

const lessonMeta = {
  locked: { icon: Lock, tone: "text-muted-foreground", bg: "bg-secondary", label: "Locked" },
  "in-progress": { icon: Play, tone: "text-gold", bg: "bg-gold/15", label: "In progress" },
  complete: { icon: CheckCircle2, tone: "text-forest", bg: "bg-forest/15", label: "Complete" },
} as const;

export function LessonCard({ lesson, onOpen }: { lesson: Lesson; onOpen?: () => void }) {
  const meta = lessonMeta[lesson.state];
  const Icon = meta.icon;
  const locked = lesson.state === "locked";

  return (
    <div
      onClick={locked ? undefined : onOpen}
      className={cn(
        "motion-base flex items-center gap-3 rounded-lg border border-border bg-charcoal p-4",
        locked ? "opacity-60" : "cursor-pointer hover:border-muted-foreground/40 hover:bg-card",
      )}
    >
      <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-md", meta.bg, meta.tone)}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-body text-sm font-semibold text-foreground">
          {lesson.order}. {lesson.title}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {lesson.durationMinutes} min · {meta.label}
        </p>
      </div>
    </div>
  );
}

const goalMeta = {
  active: { tone: "gold", label: "Active" },
  completed: { tone: "forest", label: "Completed" },
  missed: { tone: "crimson", label: "Missed" },
} as const;

export function GoalCard({ goal }: { goal: Goal }) {
  const meta = goalMeta[goal.status];
  const pct = (goal.current / goal.target) * 100;

  return (
    <Card variant={goal.status === "missed" ? "crimson" : "bordered"}>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow">{goal.dueLabel}</span>
          <span
            className={cn(
              "font-body text-xs font-semibold",
              meta.tone === "gold" && "text-gold",
              meta.tone === "forest" && "text-forest",
              meta.tone === "crimson" && "text-crimson-tint",
            )}
          >
            {meta.label}
          </span>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Target className="size-4 shrink-0 text-muted-foreground" />
          {goal.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ProgressBar
          value={pct}
          tone={meta.tone}
          label={`${goal.current}/${goal.target} ${goal.metric}`}
        />
      </CardContent>
    </Card>
  );
}

/** Marks are the achievement currency — always gold when earned. */
export function MarkBadge({ mark }: { mark: Mark }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-4",
        mark.earned ? "border-gold/35 bg-gold/8" : "border-dashed border-border bg-charcoal/60",
      )}
    >
      <span
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-full border",
          mark.earned
            ? "border-gold/50 bg-gold/15 text-gold"
            : "border-border bg-secondary text-muted-foreground",
        )}
      >
        {mark.earned ? <CheckCircle2 className="size-5" /> : <CircleDot className="size-5" />}
      </span>
      <div className="min-w-0">
        <p
          className={cn(
            "truncate font-body text-sm font-semibold",
            mark.earned ? "text-gold" : "text-muted-foreground",
          )}
        >
          {mark.name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {mark.earned ? mark.earnedLabel : mark.description}
        </p>
      </div>
    </div>
  );
}
