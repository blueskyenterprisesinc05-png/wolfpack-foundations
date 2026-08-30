import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/brand/app-shell";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  LessonRow,
  CourseHeader,
  CourseSafety,
  InstructorCard,
} from "@/components/learning/learning-shell";
import { getCourseByIdFn, getCoursesFn } from "@/lib/courses";
import { getCourseLessonsFn } from "@/lib/lessons";
import type { Lesson } from "@/types";

export const Route = createFileRoute("/courses/$courseId")({
  component: function CourseDetailWrapper() {
    return (
      <AppShell>
        <CourseDetail />
      </AppShell>
    );
  },
});

function CourseDetail() {
  const { courseId } = Route.useParams();
  const courseQuery = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseByIdFn({ data: courseId }),
  });
  const lessonsQuery = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: () => getCourseLessonsFn({ data: courseId }),
  });
  const allCoursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: () => getCoursesFn(),
  });

  const course = courseQuery.data?.course;
  const instructor = courseQuery.data?.instructor;
  const lessons = lessonsQuery.data?.lessons ?? [];
  const allCourses = allCoursesQuery.data?.courses ?? [];
  if (courseQuery.isLoading || lessonsQuery.isLoading)
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-5 w-40 rounded bg-secondary" />
          <div className="h-64 rounded-lg bg-charcoal" />
          <div className="h-48 rounded-lg bg-charcoal" />
        </div>
      </main>
    );
  if (!course || !instructor)
    return (
      <main className="grid min-h-screen place-items-center bg-background p-6">
        <Card>
          <CardHeader>
            <CardTitle>Course not found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/styleguide">Back to The Den</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  const progress = course.lessonCount ? (course.lessonsComplete / course.lessonCount) * 100 : 0;
  const current =
    lessons.find((lesson) => lesson.state === "in-progress") ??
    lessons.find((lesson) => lesson.state !== "locked");
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/styleguide" className="hover:text-foreground">
            The Den
          </Link>
          <ChevronRight className="size-4" />
          <span>{course.category}</span>
          <ChevronRight className="size-4" />
          <span className="text-foreground">{course.title}</span>
        </nav>
        <CourseHeader
          course={course}
          instructor={instructor}
          progress={progress}
          onStart={() => current && (window.location.href = `/lessons/${current.id}`)}
        />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>What you&apos;ll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 sm:grid-cols-2">
                {course.objectives.map((objective) => (
                  <li
                    key={objective}
                    className="flex gap-3 text-sm leading-6 text-muted-foreground"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                    {objective}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <InstructorCard instructor={instructor} />
        </div>
        <CourseSafety course={course} />
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Curriculum</p>
              <h2 className="display-lg mt-2 text-foreground">Course modules</h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {course.lessonsComplete}/{course.lessonCount} complete
            </span>
          </div>
          {lessons.length ? (
            (() => {
              // Group lessons by moduleId preserving insertion order
              const moduleMap = new Map<string, { label: string; lessons: Lesson[] }>();
              lessons.forEach((l) => {
                if (!moduleMap.has(l.moduleId)) {
                  moduleMap.set(l.moduleId, { label: l.moduleLabel, lessons: [] });
                }
                moduleMap.get(l.moduleId)!.lessons.push(l);
              });
              const modules = Array.from(moduleMap.entries());
              // Default open: the module containing the first in-progress lesson
              const activeModuleId =
                lessons.find((l) => l.state === "in-progress")?.moduleId ?? modules[0]?.[0];
              return (
                <Accordion type="single" collapsible defaultValue={activeModuleId ?? ""}>
                  {modules.map(([modId, mod]) => {
                    const done = mod.lessons.filter((l) => l.state === "complete").length;
                    return (
                      <AccordionItem
                        key={modId}
                        value={modId}
                        className="border border-border rounded-xl mb-3 overflow-hidden bg-charcoal"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/40">
                          <div className="flex flex-1 items-center justify-between pr-2 text-left">
                            <span className="font-semibold text-foreground">{mod.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {done}/{mod.lessons.length} complete
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                          <div className="flex flex-col divide-y divide-border border-t border-border">
                            {mod.lessons.map((lesson) => (
                              <LessonRow
                                key={lesson.id}
                                lesson={lesson}
                                onOpen={() => {
                                  window.location.href = `/lessons/${lesson.id}`;
                                }}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              );
            })()
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                <BookOpen className="size-8 text-muted-foreground" />
                <p className="font-semibold">No available lessons</p>
                <p className="text-sm text-muted-foreground">This curriculum is being prepared.</p>
              </CardContent>
            </Card>
          )}
        </section>
        <section>
          <p className="eyebrow">Keep going</p>
          <h2 className="display-lg mt-2 text-foreground">Related courses</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {allCourses
              .filter((item) => item.id !== course.id)
              .map((item) => (
                <Link
                  key={item.id}
                  to="/courses/$courseId"
                  params={{ courseId: item.id }}
                  className="rounded-lg border border-border bg-charcoal p-5 transition-colors hover:border-gold/50"
                >
                  <p className="eyebrow text-gold">{item.category}</p>
                  <p className="mt-2 text-lg font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.subtitle}</p>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}
