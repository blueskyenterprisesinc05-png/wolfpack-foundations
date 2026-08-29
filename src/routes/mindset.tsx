import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/brand/app-shell";
import { getCourseByIdFn } from "@/lib/courses";
import { getCourseLessonsFn } from "@/lib/lessons";
import { ArrowRight, Brain, Check, CheckCircle2, Clock3, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const COURSE_ID = "mind-lab";

export const Route = createFileRoute("/mindset")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: MindLabPage,
});

function LessonStateIcon({
  state,
  order,
}: {
  state: "complete" | "in-progress" | "locked" | string;
  order: number;
}) {
  if (state === "complete")
    return (
      <div className="grid size-9 shrink-0 place-items-center rounded-md bg-forest/15">
        <Check className="size-4 text-forest" />
      </div>
    );
  if (state === "locked")
    return (
      <div className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary opacity-50">
        <Lock className="size-4 text-muted-foreground" />
      </div>
    );
  if (state === "in-progress")
    return (
      <div className="grid size-9 shrink-0 place-items-center rounded-md bg-gold/15">
        <Play className="ml-0.5 size-4 text-gold" />
      </div>
    );
  return (
    <div className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary text-sm font-semibold text-muted-foreground">
      {order}
    </div>
  );
}

function MindLabPage() {
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
  const done = lessons.filter((l) => l.state === "complete").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const complete = pct >= 100;

  const current =
    lessons.find((l) => l.state === "in-progress") ??
    lessons.find((l) => l.state !== "locked" && l.state !== "complete");

  const isLoading = courseQuery.isLoading || lessonsQuery.isLoading;

  return (
    <AppShell>
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link to="/courses" className="hover:text-foreground transition-colors">
            Learning
          </Link>
          <span>/</span>
          <span className="text-foreground">Mind Lab</span>
        </nav>

        {/* Hero */}
        <header className="relative overflow-hidden rounded-xl border border-border bg-charcoal p-6 sm:p-8">
          {/* Decorative */}
          <div className="pointer-events-none absolute right-8 top-8 size-32 rounded-full border border-forest/20 opacity-60" />
          <div className="pointer-events-none absolute right-20 top-20 size-14 rounded-full bg-forest/10" />
          <div className="pointer-events-none absolute -bottom-6 -right-6 size-48 rounded-full border border-gold/10" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full border border-forest/40 bg-forest/15">
                <Brain className="size-6 text-forest" />
              </div>
              <div>
                <p className="eyebrow text-gold">Mind Lab</p>
                <p className="text-xs text-muted-foreground">
                  {instructor ? `With ${instructor.name}` : ""}
                </p>
              </div>
            </div>

            <h1 className="display-xl mt-5 max-w-lg text-foreground">
              {course?.title ?? "Mind Lab"}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
              {course?.description ?? "Build the inner habits that make consistency possible."}
            </p>

            {/* Stats row */}
            <div className="mt-5 flex flex-wrap gap-5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="size-4 text-gold" />
                {course?.durationMinutes ?? 81} min total
              </span>
              <span>{course?.lessonCount ?? 5} lessons</span>
              <span className="capitalize">{course?.level ?? "foundation"}</span>
            </div>

            {/* Progress bar */}
            <div className="mt-6 max-w-md space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {done} of {total} lessons complete
                </span>
                <span>{pct}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gold transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* CTA */}
            <div className="mt-7 flex flex-wrap gap-3">
              {complete ? (
                <Button variant="secondary" size="default" asChild>
                  <Link to="/courses/$courseId" params={{ courseId: COURSE_ID }}>
                    <CheckCircle2 className="mr-2 size-4 text-forest" />
                    Path complete — Review
                  </Link>
                </Button>
              ) : current ? (
                <Button size="default" asChild>
                  <Link to="/lessons/$lessonId" params={{ lessonId: current.id }}>
                    {done > 0 ? "Continue" : "Start"} Mind Lab
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              ) : (
                <Button size="default" asChild>
                  <Link to="/courses/$courseId" params={{ courseId: COURSE_ID }}>
                    View curriculum
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="default" asChild>
                <Link to="/courses/$courseId" params={{ courseId: COURSE_ID }}>
                  Full curriculum
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Lesson list */}
        <section aria-label="Lessons">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Curriculum</p>
              <h2 className="display-md mt-1 text-foreground">Lessons</h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {done}/{total} complete
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-charcoal" />
              ))}
            </div>
          ) : (
            <Card className="overflow-hidden divide-y divide-border">
              {lessons.map((lesson) => {
                const locked = lesson.state === "locked";
                const done = lesson.state === "complete";
                return (
                  <div
                    key={lesson.id}
                    className={cn(
                      "flex items-center gap-4 px-5 py-4 transition-colors",
                      locked ? "opacity-50" : "hover:bg-accent/40 cursor-pointer",
                    )}
                  >
                    <LessonStateIcon state={lesson.state} order={lesson.order} />
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          done ? "text-forest" : "text-foreground",
                        )}
                      >
                        {lesson.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {lesson.description} · {lesson.durationMinutes} min
                      </p>
                    </div>
                    {locked ? (
                      <span className="shrink-0 text-xs text-muted-foreground">Locked</span>
                    ) : (
                      <Button size="sm" variant={done ? "ghost" : "secondary"} asChild>
                        <Link to="/lessons/$lessonId" params={{ lessonId: lesson.id }}>
                          {done ? "Review" : lesson.state === "in-progress" ? "Continue" : "Open"}
                        </Link>
                      </Button>
                    )}
                  </div>
                );
              })}
            </Card>
          )}
        </section>

        {/* What you'll learn */}
        {course?.objectives && course.objectives.length > 0 && (
          <section>
            <p className="eyebrow">What you&apos;ll build</p>
            <h2 className="display-md mt-1 text-foreground">Learning objectives</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {course.objectives.map((obj) => (
                <li key={obj} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                  {obj}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Instructor */}
        {instructor && (
          <section>
            <p className="eyebrow">Your guide</p>
            <Card className="mt-4">
              <CardContent className="flex gap-4 p-5">
                <div className="grid size-12 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 font-semibold text-gold">
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
