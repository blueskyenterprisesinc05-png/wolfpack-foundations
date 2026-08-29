import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/brand/app-shell";
import { getCourseLessonsFn } from "@/lib/lessons";
import {
  ArrowRight,
  Brain,
  CheckSquare,
  Flame,
  LineChart,
  Target,
  TrendingUp,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { profile } = Route.useRouteContext();
  const displayName = profile?.name || "Member";

  // Use Mind Lab as the "Next up" focus
  const courseId = "mind-lab";
  const lessonsQuery = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: () => getCourseLessonsFn({ data: courseId }),
  });
  const lessons = lessonsQuery.data?.lessons ?? [];
  const done = lessons.filter((l) => l.state === "complete").length;
  const total = lessons.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const nextLesson =
    lessons.find((l) => l.state === "in-progress") ??
    lessons.find((l) => l.state !== "locked" && l.state !== "complete");
  const isComplete = lessons.length > 0 && lessons.every((l) => l.state === "complete");

  const quickLinks = [
    {
      icon: CheckSquare,
      label: "Daily Checklist",
      detail: "Morning & Evening",
      to: "/checklist",
    },
    {
      icon: LineChart,
      label: "Accountability Log",
      detail: "Log your work",
      to: "/accountability",
    },
    { icon: Video, label: "Wolf Sessions", detail: "Live recordings", to: "/sessions" },
    { icon: Brain, label: "Mind Lab", detail: "Continue your path", to: "/mindset" },
    { icon: TrendingUp, label: "Trading Room", detail: "Educational track", to: "/trading" },
  ] as const;

  return (
    <AppShell>
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex max-w-2xl flex-col gap-0 px-4 py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="border-b border-border pb-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              The 1% Club
            </p>
            <h1 className="display-xl mt-2 text-foreground">The Den</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back, {displayName}.
            </p>
          </header>

          {/* Today's mission — operational panel */}
          <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Today's Mission
          </p>
          <div className="mt-2 overflow-hidden rounded-xl border border-border bg-charcoal">
            {/* Identity row */}
            <div className="flex items-center gap-3 border-b border-border p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-forest/40 bg-forest/15">
                <Target className="size-4 text-forest" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-gold">
                  Next right step
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                  {isComplete
                    ? "Mind Lab complete — keep your daily check-ins"
                    : nextLesson?.title ?? "Start Mind Lab"}
                </p>
              </div>
              {!isComplete && (
                <span className="shrink-0 font-mono text-xs font-bold text-gold">{pct}%</span>
              )}
            </div>

            {/* Progress bar */}
            {!isComplete && (
              <div className="h-1 w-full bg-secondary">
                <div
                  className="h-full bg-gold transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}

            {/* CTA */}
            <div className="p-4">
              {nextLesson ? (
                <Button className="w-full" asChild>
                  <Link to="/lessons/$lessonId" params={{ lessonId: nextLesson.id }}>
                    Continue Lesson {nextLesson.order}
                    <ArrowRight className="ml-auto size-4" />
                  </Link>
                </Button>
              ) : (
                <Button className="w-full" asChild>
                  <Link to="/mindset">
                    Open Mind Lab
                    <ArrowRight className="ml-auto size-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Quick stats — horizontal bar */}
          <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Your Stats
          </p>
          <div className="mt-2 grid grid-cols-3 divide-x divide-border overflow-hidden rounded-xl border border-border bg-charcoal">
            <div className="flex flex-col items-center gap-1 p-4">
              <span className="font-display text-2xl text-gold">{profile?.streak ?? 12}</span>
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                <Flame className="size-3" /> Streak
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 p-4">
              <span className="font-display text-2xl text-foreground">{done}/{total}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Lessons
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 p-4">
              <span className="font-display text-2xl text-foreground">
                {profile?.completedLessons ?? 0}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Total Done
              </span>
            </div>
          </div>

          {/* Quick links — Discord-style channel list */}
          <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Do This Daily
          </p>
          <div className="mt-2 divide-y divide-border overflow-hidden rounded-xl border border-border bg-charcoal">
            {quickLinks.map(({ icon: Icon, label, detail, to }) => (
              <Link
                key={to}
                to={to}
                className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/5"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded bg-secondary text-muted-foreground group-hover:bg-gold/15 group-hover:text-gold transition-colors">
                  <Icon className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-[11px] text-muted-foreground">{detail}</p>
                </div>
                <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/40 group-hover:text-gold transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
