import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/brand/app-shell";
import { getCourseLessonsFn } from "@/lib/lessons";
import { getCoursesFn } from "@/lib/courses";
import { ArrowRight, BookOpen, Brain, CheckSquare, LineChart, Target, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const nextLesson =
    lessons.find((l) => l.state === "in-progress") ??
    lessons.find((l) => l.state !== "locked" && l.state !== "complete");
  const isComplete = lessons.length > 0 && lessons.every((l) => l.state === "complete");

  return (
    <AppShell>
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
          <header className="border-b border-border pb-8">
            <p className="eyebrow text-gold">The Den</p>
            <h1 className="display-xl mt-3 text-foreground">Welcome back, {displayName}.</h1>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground">
              Your practice, in one place. Keep the bar clear and the promise small.
            </p>
          </header>

          <section className="grid gap-6 md:grid-cols-3" aria-label="Dashboard Overview">
            {/* Today's Action */}
            <div className="md:col-span-2">
              <Card className="h-full overflow-hidden border-border bg-charcoal">
                <div className="relative overflow-hidden bg-forest/10 p-6 sm:p-8">
                  <div className="absolute right-6 top-6 size-24 rounded-full border border-gold/20 opacity-60" />
                  <div className="absolute right-14 top-14 size-10 rounded-full bg-gold/10" />
                  <div className="relative">
                    <div className="flex size-12 items-center justify-center rounded-full border border-forest/40 bg-forest/15">
                      <Target className="size-5 text-forest" />
                    </div>
                    <p className="eyebrow mt-5 text-gold">Today's next right step</p>
                    <h2 className="display-lg mt-2 text-foreground">
                      {isComplete
                        ? "Mind Lab Complete"
                        : nextLesson
                          ? nextLesson.title
                          : "Mind Lab"}
                    </h2>
                  </div>
                </div>
                <CardContent className="p-6 sm:p-8">
                  <p className="text-base leading-7 text-muted-foreground">
                    {isComplete
                      ? "You've completed the foundation. Keep up your daily check-ins."
                      : "Return to the work that is already in front of you."}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4">
                    {nextLesson ? (
                      <Button asChild>
                        <Link to="/lessons/$lessonId" params={{ lessonId: nextLesson.id }}>
                          Continue Lesson {nextLesson.order}
                          <ArrowRight className="ml-2 size-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild>
                        <Link to="/mindset">
                          Open Mind Lab
                          <ArrowRight className="ml-2 size-4" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="secondary" asChild>
                      <Link to="/progress">View Progress</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-4">
              <Link to="/checklist" className="group">
                <Card className="h-full border-border bg-charcoal transition-all hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                      <CheckSquare className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Daily Checklist</p>
                      <p className="text-xs text-muted-foreground">Morning & Evening</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/accountability" className="group">
                <Card className="h-full border-border bg-charcoal transition-all hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                      <LineChart className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Accountability</p>
                      <p className="text-xs text-muted-foreground">Log your trades</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/sessions" className="group">
                <Card className="h-full border-border bg-charcoal transition-all hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                      <Video className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Wolf Sessions</p>
                      <p className="text-xs text-muted-foreground">Live recordings</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
