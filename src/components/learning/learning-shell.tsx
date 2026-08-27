import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  Lock,
  Play,
  Save,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ProgressBar } from "@/components/brand/progress";
import { RiskDisclaimer } from "@/components/brand/risk-disclaimer";
import { cn } from "@/lib/utils";
import type { Course, Instructor, Lesson, LessonProgress, Resource } from "@/types";

export function CourseCover({ course }: { course: Course }) {
  return (
    <div
      className={cn(
        "relative flex min-h-52 items-end overflow-hidden rounded-lg border border-border bg-charcoal p-6",
        course.category === "Trading Room" ? "bg-crimson/20" : "bg-forest/15",
      )}
    >
      <div className="absolute right-6 top-6 size-20 rounded-full border border-gold/30" />
      <div className="absolute right-12 top-12 size-8 rounded-full bg-gold/20" />
      <div>
        <p className="eyebrow text-gold">The 1% Club / {course.category}</p>
        <p className="display-lg mt-2 max-w-xs text-foreground">{course.coverLabel}</p>
      </div>
    </div>
  );
}

export function CourseHeader({
  course,
  instructor,
  progress,
  onStart,
}: {
  course: Course;
  instructor: Instructor;
  progress: number;
  onStart: () => void;
}) {
  const complete = progress >= 100;
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,.9fr)] lg:items-end">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow text-gold">{course.category}</span>
          <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
            {course.level}
          </span>
        </div>
        <h1 className="display-xl mt-4 text-foreground">{course.title}</h1>
        <p className="body-lg mt-4 max-w-2xl text-muted-foreground">{course.description}</p>
        <div className="mt-6 flex flex-wrap gap-5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Clock3 className="size-4 text-gold" />
            {course.durationMinutes} min
          </span>
          <span>{course.lessonCount} lessons</span>
          <span>With {instructor.name}</span>
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button variant={complete ? "secondary" : "gold"} onClick={onStart}>
            {complete ? "Review course" : progress > 0 ? "Continue learning" : "Start course"}
            <ArrowRight className="ml-2 size-4" />
          </Button>
          {complete && (
            <span className="inline-flex items-center gap-2 px-2 text-sm text-forest">
              <CheckCircle2 className="size-4" />
              Course complete
            </span>
          )}
        </div>
      </div>
      <CourseCover course={course} />
    </div>
  );
}

export function InstructorCard({ instructor }: { instructor: Instructor }) {
  return (
    <Card variant="bordered">
      <CardContent className="flex gap-4 p-5">
        <div className="grid size-12 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 font-semibold text-gold">
          {instructor.initials}
        </div>
        <div>
          <p className="eyebrow">Instructor</p>
          <h3 className="mt-1 text-lg text-foreground">{instructor.name}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{instructor.bio}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function LessonRow({ lesson, onOpen }: { lesson: Lesson; onOpen: () => void }) {
  const locked = lesson.state === "locked";
  const complete = lesson.state === "complete";
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-border px-4 py-4 last:border-0",
        locked && "opacity-55",
      )}
    >
      <div
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-md text-sm font-semibold",
          complete
            ? "bg-forest/15 text-forest"
            : lesson.state === "in-progress"
              ? "bg-gold/15 text-gold"
              : "bg-secondary text-muted-foreground",
        )}
      >
        {complete ? (
          <Check className="size-4" />
        ) : locked ? (
          <Lock className="size-4" />
        ) : (
          lesson.order
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground">{lesson.title}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {lesson.description} · {lesson.durationMinutes} min
        </p>
      </div>
      {locked ? (
        <span className="text-xs text-muted-foreground">Locked</span>
      ) : (
        <Button size="sm" variant={complete ? "ghost" : "secondary"} onClick={onOpen}>
          {complete ? "Review" : lesson.state === "in-progress" ? "Continue" : "Open"}
        </Button>
      )}
    </div>
  );
}

export function LessonContent({
  lesson,
  progress,
  onComplete,
  onNotes,
  resource,
}: {
  lesson: Lesson;
  progress: LessonProgress;
  onComplete: () => void;
  onNotes: (value: string) => void;
  resource?: Resource;
}) {
  const content = lesson.content;
  if (!content)
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          This lesson is being prepared. Check back soon.
        </CardContent>
      </Card>
    );
  return (
    <div className="space-y-6">
      <div className="aspect-video overflow-hidden rounded-lg border border-border bg-charcoal">
        <div className="grid h-full place-items-center">
          <div className="text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
              <Play className="ml-1 size-6" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Video lesson placeholder</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Audio-visual content will be available here
            </p>
          </div>
        </div>
      </div>
      <article className="space-y-8">
        <section>
          <p className="eyebrow">Lesson introduction</p>
          <p className="body-lg mt-3 text-foreground">{content.introduction}</p>
        </section>
        <section className="space-y-4">
          <p className="eyebrow">The practice</p>
          {content.teaching.map((text) => (
            <p key={text} className="leading-7 text-muted-foreground">
              {text}
            </p>
          ))}
        </section>
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>{content.example.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-7 text-muted-foreground">{content.example.body}</p>
          </CardContent>
        </Card>
        <section>
          <p className="eyebrow">Practical exercise</p>
          <p className="mt-3 leading-7 text-muted-foreground">{content.exercise}</p>
        </section>
        <section>
          <p className="eyebrow">Key takeaways</p>
          <ul className="mt-3 space-y-3">
            {content.takeaways.map((item) => (
              <li key={item} className="flex gap-3 leading-6 text-muted-foreground">
                <Check className="mt-1 size-4 shrink-0 text-forest" />
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section className="border-l-2 border-gold/50 pl-4">
          <p className="eyebrow">Reflection question</p>
          <p className="mt-2 text-lg text-foreground">{content.reflection}</p>
        </section>
      </article>
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>Your notes stay in this browser for this demo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={progress.notes}
            onChange={(event) => onNotes(event.target.value)}
            placeholder="What are you taking from this lesson?"
            className="min-h-28 bg-obsidian"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.success("Note saved for this lesson.")}
          >
            <Save className="mr-2 size-4" />
            Save note
          </Button>
        </CardContent>
      </Card>
      {resource && (
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => toast("Resource preview is coming soon.")}
        >
          <span className="inline-flex items-center gap-2">
            <Download className="size-4 text-gold" />
            {resource.title}
          </span>
          <span className="text-xs text-muted-foreground">{resource.type}</span>
        </Button>
      )}
      <Button
        className="w-full"
        variant={progress.status === "complete" ? "secondary" : "gold"}
        onClick={onComplete}
      >
        {progress.status === "complete" ? (
          <>
            <CheckCircle2 className="mr-2 size-4 text-forest" />
            Lesson complete
          </>
        ) : (
          "Mark as complete"
        )}
      </Button>
    </div>
  );
}

export function LessonNav({
  course,
  previous,
  next,
}: {
  course: Course;
  previous?: Lesson;
  next?: Lesson;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
      <div>
        {previous ? (
          <Button asChild variant="ghost" size="sm">
            <Link to="/lessons/$lessonId" params={{ lessonId: previous.id }}>
              <ArrowLeft className="mr-2 size-4" />
              Previous
            </Link>
          </Button>
        ) : (
          <span />
        )}
      </div>
      <Button asChild variant="secondary" size="sm">
        <Link to="/courses/$courseId" params={{ courseId: course.id }}>
          Back to course
        </Link>
      </Button>
      {next ? (
        <Button asChild variant="ghost" size="sm">
          <Link to="/lessons/$lessonId" params={{ lessonId: next.id }}>
            Next
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      ) : (
        <span />
      )}
    </div>
  );
}

export function CourseSafety({ course }: { course: Course }) {
  return course.category === "Trading Room" ? (
    <div className="mt-8">
      <RiskDisclaimer />
      <div className="mt-3 flex gap-3 rounded-lg border border-gold/25 bg-gold/5 p-4 text-sm leading-6 text-muted-foreground">
        <ShieldAlert className="mt-1 size-4 shrink-0 text-gold" />
        <p>
          The Trading Room is for education and skill development. Trading involves risk, and the 1%
          Club does not guarantee profits or financial results.
        </p>
      </div>
    </div>
  ) : null;
}
