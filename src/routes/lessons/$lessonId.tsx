import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LessonContent, LessonNav } from "@/components/learning/learning-shell";
import { mockLessonProgress } from "@/data/mock";
import { getLessonByIdFn, getCourseLessonsFn } from "@/lib/lessons";
import { getCourseByIdFn } from "@/lib/courses";
import type { LessonProgress } from "@/types";

export const Route = createFileRoute("/lessons/$lessonId")({ component: LessonDetail });

function LessonDetail() {
  const { lessonId } = Route.useParams();
  const lessonQuery = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => getLessonByIdFn({ data: lessonId }),
  });
  
  const lesson = lessonQuery.data?.lesson;
  const resources = lessonQuery.data?.resources ?? [];
  const courseId = lesson?.courseId;
  
  const courseQuery = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseByIdFn({ data: courseId! }),
    enabled: Boolean(courseId),
  });

  const course = courseQuery.data?.course;

  const lessonsQuery = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: () => getCourseLessonsFn({ data: courseId! }),
    enabled: Boolean(courseId),
  });
  const initial = mockLessonProgress.find((item) => item.lessonId === lessonId) ?? {
    lessonId,
    status: "not-started" as const,
    notes: "",
  };
  const [progress, setProgress] = useState<LessonProgress>(initial);
  useEffect(() => {
    setProgress(initial);
  }, [lessonId]);
  if (lessonQuery.isLoading || courseQuery.isLoading || lessonsQuery.isLoading)
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-3xl animate-pulse space-y-5">
          <div className="h-5 w-48 rounded bg-secondary" />
          <div className="aspect-video rounded-lg bg-charcoal" />
          <div className="h-64 rounded-lg bg-charcoal" />
        </div>
      </main>
    );
  if (!lesson || !course)
    return (
      <main className="grid min-h-screen place-items-center bg-background p-6">
        <Card>
          <CardContent className="space-y-4 p-8">
            <p className="font-semibold">Lesson not found</p>
            <Button asChild>
              <Link to="/styleguide">Back to The Den</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  const lessons = lessonsQuery.data?.lessons ?? [];
  const index = lessons.findIndex((item) => item.id === lesson.id);
  const previous = lessons[index - 1];
  const next = lessons[index + 1];
  const complete = () => {
    setProgress((current) => ({
      ...current,
      status: "complete",
      updatedAt: new Date().toISOString(),
    }));
    toast.success("Lesson marked complete.");
  };
  const setNotes = (notes: string) =>
    setProgress((current) => ({
      ...current,
      notes,
      status: current.status === "not-started" ? "in-progress" : current.status,
    }));
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link
            to="/courses/$courseId"
            params={{ courseId: course.id }}
            className="hover:text-foreground"
          >
            {course.title}
          </Link>
          <ChevronRight className="size-4" />
          <span>Lesson {lesson.order}</span>
          <ChevronRight className="size-4" />
          <span className="text-foreground">{lesson.title}</span>
        </nav>
        <header className="mb-8">
          <p className="eyebrow text-gold">
            Lesson {String(lesson.order).padStart(2, "0")} / {course.category}
          </p>
          <h1 className="display-xl mt-3 text-foreground">{lesson.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {lesson.durationMinutes} minutes ·{" "}
            {progress.status === "complete"
              ? "Completed"
              : progress.status === "in-progress"
                ? "In progress"
                : "Not started"}
          </p>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>Lesson progress</span>
              <span>
                {progress.status === "complete"
                  ? "100%"
                  : progress.status === "in-progress"
                    ? "50%"
                    : "0%"}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-gold transition-all"
                style={{
                  width:
                    progress.status === "complete"
                      ? "100%"
                      : progress.status === "in-progress"
                        ? "50%"
                        : "0%",
                }}
              />
            </div>
          </div>
        </header>
        <LessonContent
          lesson={lesson}
          progress={progress}
          onComplete={complete}
          onNotes={setNotes}
          {...(() => {
            const resource = resources.length > 0 ? resources[0] : undefined;
            return resource ? { resource } : {};
          })()}
        />
        <LessonNav
          course={course}
          {...(previous ? { previous } : {})}
          {...(next ? { next } : {})}
        />
      </div>
    </main>
  );
}
