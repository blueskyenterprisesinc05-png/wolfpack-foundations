import { ArrowRight, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Course } from "@/data/member";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
export function CourseGrid({ courses }: { courses: Course[] }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Beginner", "Intermediate", "Completed"];
  const visible = courses.filter(
    (course) =>
      filter === "All" ||
      (filter === "Completed" ? course.progress === 100 : course.difficulty === filter),
  );
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <Button
            key={item}
            variant={filter === item ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter(item)}
          >
            {item}
          </Button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((course) => (
          <Card
            key={course.title}
            variant="bordered"
            interactive={course.available}
            className="flex flex-col"
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <Badge variant="outline">{course.difficulty}</Badge>
                {!course.available && <LockKeyhole className="size-4 text-muted-foreground" />}
              </div>
              <CardTitle className="mt-2">{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{course.lessons} lessons</span>
                <span>{course.progress}% complete</span>
              </div>
              <Progress value={course.progress} className="mt-2" />
              <Button
                className="mt-5 w-full"
                variant={course.available ? "outline" : "ghost"}
                disabled={!course.available}
                onClick={() => toast(`${course.title} selected`)}
              >
                {course.available ? (
                  <>
                    Continue <ArrowRight />
                  </>
                ) : (
                  "Coming soon"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
