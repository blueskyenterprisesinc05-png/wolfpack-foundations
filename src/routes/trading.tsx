import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/brand/app-shell";
import { getCourseByIdFn } from "@/lib/courses";
import { getCourseLessonsFn } from "@/lib/lessons";
import {
  ArrowRight,
  CandlestickChart,
  Check,
  CheckCircle2,
  Clock3,
  Lock,
  Play,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RiskDisclaimer } from "@/components/brand/risk-disclaimer";

const COURSE_ID = "trading-room";

export const Route = createFileRoute("/trading")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: TradingRoomPage,
});

function TradingRoomPage() {
  const courseQuery = useQuery({
    queryKey: ["course", COURSE_ID],
    queryFn: () => getCourseByIdFn({ data: COURSE_ID }),
  });
  const lessonsQuery = useQuery({
    queryKey: ["lessons", COURSE_ID],
    queryFn: () => getCourseLessonsFn({ data: COURSE_ID }),
  });

  const course = courseQuery.data?.course;
  const instructor = courseQuery.data?.instructor;
  const lessons = lessonsQuery.data?.lessons ?? [];

  const total = lessons.length;
  const doneCount = lessons.filter((l) => l.state === "complete").length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const complete = pct >= 100;

  const current =
    lessons.find((l) => l.state === "in-progress") ??
    lessons.find((l) => l.state !== "locked" && l.state !== "complete");

  const isLoading = courseQuery.isLoading || lessonsQuery.isLoading;

  return (
    <AppShell>
      <div className="mx-auto flex max-w-2xl flex-col gap-0 px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/courses" className="transition-colors hover:text-foreground">
            Learning
          </Link>
          <span>/</span>
          <span className="text-foreground">Trading Room</span>
        </nav>

        {/* Hero — compact operational header */}
        <header className="mt-4 overflow-hidden rounded-xl border border-border bg-charcoal">
          {/* Top identity row */}
          <div className="flex items-center gap-3 border-b border-border p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-gold/40 bg-gold/10">
              <CandlestickChart className="size-5 text-gold" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">{course?.title ?? "Trading Room"}</p>
              {instructor && (
                <p className="text-xs text-muted-foreground">With {instructor.name}</p>
              )}
            </div>
            <span className="shrink-0 font-mono text-xs font-bold text-gold">{pct}%</span>
          </div>

          {/* Progress bar — prominent, full-width */}
          <div className="h-1.5 w-full bg-secondary">
            <div
              className="h-full bg-gold transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 px-4 py-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-3 text-gold" />
              {course?.durationMinutes ?? 117} min
            </span>
            <span>
              {doneCount} of {total} lessons complete
            </span>
            <span className="capitalize">{course?.level ?? "Intermediate"}</span>
          </div>

          {/* CTA */}
          <div className="border-t border-border p-4">
            {complete ? (
              <Button variant="secondary" className="w-full" asChild>
                <Link to="/courses/$courseId" params={{ courseId: COURSE_ID }}>
                  <CheckCircle2 className="size-4 text-forest" />
                  Path complete — Review
                </Link>
              </Button>
            ) : current ? (
              <Button className="w-full" asChild>
                <Link to="/lessons/$lessonId" params={{ lessonId: current.id }}>
                  {doneCount > 0 ? "Continue" : "Start"} Trading Room
                  <ArrowRight className="ml-auto size-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="secondary" className="w-full" asChild>
                <Link to="/courses/$courseId" params={{ courseId: COURSE_ID }}>
                  View curriculum
                  <ArrowRight className="ml-auto size-4" />
                </Link>
              </Button>
            )}
          </div>
        </header>

        {/* Risk disclaimer */}
        <div className="mt-4 space-y-2">
          <RiskDisclaimer />
          <div className="flex gap-3 rounded-lg border border-gold/25 bg-gold/5 p-3 text-xs leading-5 text-muted-foreground">
            <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-gold" />
            <p>
              The Trading Room is for education and skill development only. Trading involves risk and
              the 1% Club does not guarantee profits or financial results. This content does not
              constitute financial advice.
            </p>
          </div>
        </div>

        {/* Lesson list — dense rows */}
        <section className="mt-6" aria-label="Lessons">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Curriculum · {doneCount}/{total} complete
          </p>

          {isLoading ? (
            <div className="space-y-px overflow-hidden rounded-xl border border-border">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 animate-pulse bg-charcoal" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-charcoal">
              {lessons.map((lesson) => {
                const isLocked = lesson.state === "locked";
                const isComplete = lesson.state === "complete";
                const isActive = lesson.state === "in-progress";

                const row = (
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 transition-colors",
                      isLocked
                        ? "cursor-default opacity-45"
                        : "cursor-pointer hover:bg-white/5",
                    )}
                  >
                    {/* Lesson number badge */}
                    <div
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded font-mono text-xs font-bold",
                        isComplete
                          ? "bg-forest/20 text-forest"
                          : isActive
                            ? "bg-gold/20 text-gold"
                            : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {isComplete ? (
                        <Check className="size-3.5" />
                      ) : isActive ? (
                        <Play className="ml-0.5 size-3.5" />
                      ) : (
                        lesson.order
                      )}
                    </div>

                    {/* Title */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium leading-tight",
                          isComplete
                            ? "text-forest"
                            : isActive
                              ? "text-foreground"
                              : isLocked
                                ? "text-muted-foreground"
                                : "text-foreground",
                        )}
                      >
                        {lesson.title}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {lesson.durationMinutes} min
                      </p>
                    </div>

                    {/* State indicator — flush right */}
                    {isLocked ? (
                      <Lock className="size-3.5 shrink-0 text-muted-foreground" />
                    ) : (
                      <ArrowRight
                        className={cn(
                          "size-3.5 shrink-0",
                          isComplete ? "text-forest/60" : "text-muted-foreground",
                        )}
                      />
                    )}
                  </div>
                );

                return isLocked ? (
                  <div key={lesson.id}>{row}</div>
                ) : (
                  <Link
                    key={lesson.id}
                    to="/lessons/$lessonId"
                    params={{ lessonId: lesson.id }}
                  >
                    {row}
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* What you'll learn */}
        {course?.objectives && course.objectives.length > 0 && (
          <section className="mt-6">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              What you&apos;ll build
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {course.objectives.map((obj) => (
                <li key={obj} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" />
                  {obj}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Instructor */}
        {instructor && (
          <section className="mt-6">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Your guide
            </p>
            <Card className="border-border bg-charcoal">
              <CardContent className="flex gap-4 p-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 font-semibold text-gold">
                  {instructor.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{instructor.name}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{instructor.bio}</p>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </AppShell>
  );
}
