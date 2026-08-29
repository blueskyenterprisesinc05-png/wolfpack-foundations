import { createServerFn } from "@tanstack/react-start";
import { createSupabaseServerClient } from "./supabase/server";
import { getCurrentEntitlementFn, EXPLORER_TIER } from "./entitlement";
import type { Lesson, Resource, MembershipTier } from "../types";

function hasAccess(userTier: MembershipTier, courseTier: string): boolean {
  if (courseTier === "free") return true;
  if (courseTier === "member" && (userTier === "member" || userTier === "inner-circle")) return true;
  if (courseTier === "inner-circle" && userTier === "inner-circle") return true;
  return false;
}

export const getCourseLessonsFn = createServerFn({ method: "GET" })
  .validator((courseId: string) => courseId)
  .handler(async ({ data: courseId }): Promise<{ lessons: Lesson[] }> => {
    const supabase = createSupabaseServerClient();
    
    // Check entitlement to determine if we should show them as locked
    const entitlementRes = await getCurrentEntitlementFn();
    const userTier = entitlementRes.tier;

    // Fetch the course tier
    const { data: courseRow } = await supabase.from("courses").select("tier").eq("id", courseId).single();
    const courseTier = courseRow?.tier || "inner-circle"; // fail secure

    const accessGranted = hasAccess(userTier, courseTier);

    // Fetch lessons (we intentionally do not fetch 'content' in the list view to save bandwidth)
    const { data, error } = await supabase
      .from("lessons")
      .select("id, course_id, title, description, duration_minutes, sort_order, summary")
      .eq("course_id", courseId)
      .order("sort_order", { ascending: true });

    if (error || !data) {
      return { lessons: [] };
    }

    const lessons: Lesson[] = data.map((row: any) => ({
      id: row.id,
      courseId: row.course_id,
      title: row.title,
      description: row.description,
      durationMinutes: row.duration_minutes,
      order: row.sort_order,
      summary: row.summary,
      // If no access, locked. If access, mock as in-progress (progress will be real in Issue 8)
      state: accessGranted ? "in-progress" : "locked" 
    }));

    return { lessons };
  });

export const getLessonByIdFn = createServerFn({ method: "GET" })
  .validator((lessonId: string) => lessonId)
  .handler(async ({ data: lessonId }): Promise<{ lesson: Lesson | null, resources: Resource[] }> => {
    const supabase = createSupabaseServerClient();
    
    // Fetch lesson and course tier
    const { data: row, error } = await supabase
      .from("lessons")
      .select(`
        id, course_id, title, description, duration_minutes, sort_order, summary, content,
        courses(tier)
      `)
      .eq("id", lessonId)
      .single();

    if (error || !row) {
      return { lesson: null, resources: [] };
    }

    const courseTier = (row.courses as any)?.tier || "inner-circle";
    const entitlementRes = await getCurrentEntitlementFn();
    const accessGranted = hasAccess(entitlementRes.tier, courseTier);

    const lesson: Lesson = {
      id: row.id,
      courseId: row.course_id,
      title: row.title,
      description: row.description,
      durationMinutes: row.duration_minutes,
      order: row.sort_order,
      summary: row.summary,
      state: accessGranted ? "in-progress" : "locked",
      // Strip content if unauthorized
      content: accessGranted ? row.content : undefined
    };

    // Fetch resources only if authorized
    let resources: Resource[] = [];
    if (accessGranted) {
      const { data: resData } = await supabase
        .from("lesson_resources")
        .select("id, title, type")
        .eq("lesson_id", lessonId);
      
      if (resData) {
        resources = resData.map((r: any) => ({
          id: r.id,
          lessonId,
          title: r.title,
          type: r.type as any
        }));
      }
    }

    return { lesson, resources };
  });
