import { createServerFn } from "@tanstack/react-start";
import { createSupabaseServerClient } from "./supabase/server";
import type { Course, CourseObjective, Instructor } from "../types";

export const getCoursesFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ courses: Course[] }> => {
    const supabase = createSupabaseServerClient();
    
    // We select courses, joined with course_objectives.
    const { data, error } = await supabase
      .from("courses")
      .select(`
        id, title, subtitle, category, description, level, 
        lesson_count, tier, cover_label, instructor_id, duration_minutes,
        course_objectives(label)
      `);

    if (error || !data) {
      console.error("Error fetching courses:", error);
      return { courses: [] };
    }

    const courses: Course[] = data.map((row: any) => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      category: row.category as any,
      description: row.description,
      level: row.level as any,
      lessonCount: row.lesson_count,
      lessonsComplete: 0, // Mock progress for now (Issue 8)
      tier: row.tier as any,
      coverLabel: row.cover_label,
      instructorId: row.instructor_id,
      durationMinutes: row.duration_minutes,
      objectives: (row.course_objectives || []).map((o: any) => o.label)
    }));

    return { courses };
  }
);

export const getCourseByIdFn = createServerFn({ method: "GET" })
  .validator((courseId: string) => courseId)
  .handler(async ({ data: courseId }): Promise<{ course: Course | null, instructor: Instructor | null }> => {
    const supabase = createSupabaseServerClient();
    
    const { data: row, error } = await supabase
      .from("courses")
      .select(`
        id, title, subtitle, category, description, level, 
        lesson_count, tier, cover_label, instructor_id, duration_minutes,
        course_objectives(label),
        instructors(id, name, initials, bio)
      `)
      .eq("id", courseId)
      .single();

    if (error || !row) {
      return { course: null, instructor: null };
    }

    const course: Course = {
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      category: row.category as any,
      description: row.description,
      level: row.level as any,
      lessonCount: row.lesson_count,
      lessonsComplete: 0, // Mock progress for now (Issue 8)
      tier: row.tier as any,
      coverLabel: row.cover_label,
      instructorId: row.instructor_id,
      durationMinutes: row.duration_minutes,
      objectives: (row.course_objectives || []).map((o: any) => o.label)
    };
    
    const instructorData = row.instructors as any;
    const instructor: Instructor | null = instructorData ? {
      id: instructorData.id,
      name: instructorData.name,
      initials: instructorData.initials,
      bio: instructorData.bio
    } : null;

    return { course, instructor };
  });
