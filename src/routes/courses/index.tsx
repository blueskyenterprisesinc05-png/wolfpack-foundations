import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/brand/app-shell";
import { getCoursesFn } from "@/lib/courses";
import { getCourseLessonsFn } from "@/lib/lessons";
import { ArrowRight, Brain, CandlestickChart, Clock3, BookOpen, Lock } from "lucide-react";
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
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {done} / {total} lessons complete
        </span>
        <span className="font-mono text-gold">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
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
      <div className="mx-auto flex max-w-2xl flex-col gap-0 px-4 py-6 sm:px-6 lg:px-8">
        {/* Page header */}
        <header className="border-b border-border pb-5">
          <p className="eyebrow text-gold">The 1% Club</p>
          <h1 className="display-xl mt-2 text-foreground">Learning Center</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Two structured paths. One develops the mind; the other develops the process.
          </p>
        </header>

        {/* Section label */}
        <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          Your Paths
        </p>

        {/* Path cards — full-width stacked, TWR-style */}
        <section className="mt-2 flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-charcoal" aria-label="Learning paths">
          {/* Mind Lab */}
          <div className="flex flex-col">
            {/* Icon + meta row */}
            <div className="flex items-center gap-4 p-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-forest/40 bg-forest/15">
                <Brain className="size-6 text-forest" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">{mindLab?.title ?? "Mind Lab"}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="size-3 text-gold" />
                    {mindLab?.durationMinutes ?? 81} min
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <BookOpen className="size-3" />
                    {mindLab?.lessonCount ?? 5} lessons
                  </span>
                  <span className="capitalize">{mindLab?.level ?? "Foundation"}</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-4 pb-2">
              <PathProgress courseId="mind-lab" />
            </div>

            {/* Full-bleed CTA */}
            <div className="p-4 pt-3">
              <Button className="w-full" asChild>
                <Link to="/mindset">
                  Enter Mind Lab
                  <ArrowRight className="ml-auto size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Trading Room */}
          <div className="flex flex-col">
            {/* Icon + meta row */}
            <div className="flex items-center gap-4 p-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-gold/40 bg-gold/10">
                <CandlestickChart className="size-6 text-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{tradingRoom?.title ?? "Trading Room"}</p>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                    <Lock className="size-2.5" />
                    Member
                  </span>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="size-3 text-gold" />
                    {tradingRoom?.durationMinutes ?? 117} min
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <BookOpen className="size-3" />
                    {tradingRoom?.lessonCount ?? 6} lessons
                  </span>
                  <span className="capitalize">{tradingRoom?.level ?? "Intermediate"}</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-4 pb-2">
              <PathProgress courseId="trading-room" />
            </div>

            {/* Full-bleed CTA */}
            <div className="p-4 pt-3">
              <Button className="w-full" asChild>
                <Link to="/trading">
                  Enter Trading Room
                  <ArrowRight className="ml-auto size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <footer className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-charcoal/60 p-4 text-xs text-muted-foreground">
          <BookOpen className="mt-0.5 size-4 shrink-0 text-gold" />
          <p>
            Both paths are educational only.{" "}
            <strong className="font-semibold text-foreground">Mind Lab</strong> is available on the
            free tier. <strong className="font-semibold text-foreground">Trading Room</strong>{" "}
            requires an active membership.
          </p>
        </footer>
      </div>
    </AppShell>
  );
}
