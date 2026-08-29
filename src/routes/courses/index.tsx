import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/brand/app-shell";
import { getCoursesFn } from "@/lib/courses";
import { getCourseLessonsFn } from "@/lib/lessons";
import { ArrowRight, BookOpen, Brain, CandlestickChart, Clock3, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/courses/")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  component: LearningCenter,
});

function PathProgress({ courseId }: { courseId: string }) {
  const lessonsQuery = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: () => getCourseLessonsFn({ data: courseId }),
  });
  const lessons = lessonsQuery.data?.lessons ?? [];
  const total = lessons.length;
  const done = lessons.filter((l) => l.state === "complete").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {done} / {total} lessons
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
  );
}

function LearningCenter() {
  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: () => getCoursesFn(),
  });

  const courses = coursesQuery.data?.courses ?? [];
  const mindLab = courses.find((c) => c.id === "mind-lab");
  const tradingRoom = courses.find((c) => c.id === "trading-room");

  return (
    <AppShell>
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <header className="border-b border-border pb-8">
          <p className="eyebrow text-gold">Learning Center</p>
          <h1 className="display-xl mt-3 text-foreground">Your Paths</h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground">
            Two structured tracks. One develops the mind; the other develops a process. Both require
            small, honest repetition.
          </p>
        </header>

        {/* Path cards */}
        <section className="grid gap-6 lg:grid-cols-2" aria-label="Learning paths">
          {/* Mind Lab */}
          <div
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-charcoal transition-all duration-300",
              "hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5",
            )}
          >
            {/* Card hero */}
            <div className="relative min-h-44 overflow-hidden bg-forest/10 p-6">
              <div className="absolute right-6 top-6 size-24 rounded-full border border-gold/20 opacity-60" />
              <div className="absolute right-14 top-14 size-10 rounded-full bg-gold/10" />
              <div className="absolute -bottom-4 -left-4 size-32 rounded-full border border-forest/20" />
              <div className="relative">
                <div className="flex size-12 items-center justify-center rounded-full border border-forest/40 bg-forest/15">
                  <Brain className="size-5 text-forest" />
                </div>
                <p className="eyebrow mt-4 text-gold">Mind Lab</p>
                <h2 className="display-lg mt-2 text-foreground">{mindLab?.title ?? "Mind Lab"}</h2>
              </div>
            </div>

            {/* Card body */}
            <div className="flex flex-1 flex-col gap-5 p-6">
              <p className="text-sm leading-6 text-muted-foreground">
                {mindLab?.description ?? "Build the inner habits that make consistency possible."}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-3.5 text-gold" />
                  {mindLab?.durationMinutes ?? 81} min
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="size-3.5" />
                  {mindLab?.lessonCount ?? 5} lessons
                </span>
                <span className="inline-flex items-center gap-1.5 capitalize">
                  {mindLab?.level ?? "foundation"}
                </span>
              </div>

              {/* Progress */}
              <PathProgress courseId="mind-lab" />

              {/* CTA */}
              <div className="mt-auto pt-2">
                <Button className="w-full" asChild>
                  <Link to="/mindset">
                    Enter Mind Lab
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Trading Room */}
          <div
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-charcoal transition-all duration-300",
              "hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5",
            )}
          >
            {/* Card hero */}
            <div className="relative min-h-44 overflow-hidden bg-crimson/8 p-6">
              <div className="absolute right-6 top-6 size-24 rounded-full border border-crimson/20 opacity-60" />
              <div className="absolute right-14 top-14 size-10 rounded-full bg-crimson/10" />
              <div className="absolute -bottom-4 -left-4 size-32 rounded-full border border-gold/10" />
              <div className="relative">
                <div className="flex size-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                  <CandlestickChart className="size-5 text-gold" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <p className="eyebrow text-gold">Trading Room</p>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                    <Lock className="size-2.5" />
                    Member
                  </span>
                </div>
                <h2 className="display-lg mt-2 text-foreground">
                  {tradingRoom?.title ?? "Trading Room"}
                </h2>
              </div>
            </div>

            {/* Card body */}
            <div className="flex flex-1 flex-col gap-5 p-6">
              <p className="text-sm leading-6 text-muted-foreground">
                {tradingRoom?.description ??
                  "An educational track for building a grounded trading process."}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-3.5 text-gold" />
                  {tradingRoom?.durationMinutes ?? 117} min
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="size-3.5" />
                  {tradingRoom?.lessonCount ?? 6} lessons
                </span>
                <span className="inline-flex items-center gap-1.5 capitalize">
                  {tradingRoom?.level ?? "intermediate"}
                </span>
              </div>

              {/* Progress */}
              <PathProgress courseId="trading-room" />

              {/* CTA */}
              <div className="mt-auto pt-2">
                <Button className="w-full" asChild>
                  <Link to="/trading">
                    Enter Trading Room
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <footer className="flex items-start gap-3 rounded-lg border border-border bg-charcoal p-5 text-sm text-muted-foreground">
          <BookOpen className="mt-0.5 size-4 shrink-0 text-gold" />
          <p>
            Both paths are educational only.{" "}
            <strong className="font-semibold text-foreground">Mind Lab</strong> is available on the
            free tier. <strong className="font-semibold text-foreground">Trading Room</strong>{" "}
            requires an active membership. Completion is not guaranteed and past engagement does not
            predict future consistency.
          </p>
        </footer>
      </div>
    </AppShell>
  );
}
