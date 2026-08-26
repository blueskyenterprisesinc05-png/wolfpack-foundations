import { mockCourses, mockGoals, mockLessons, mockMarks, mockMember } from "@/data/mock";
import type { Course, Goal, Lesson, Mark, Member } from "@/types";

/**
 * Phase 0 scaffolding: pages never hold their own data. Swap these resolvers for
 * real server functions in a later phase without touching component code.
 */
const latency = 220;

function resolve<T>(value: T): Promise<T> {
  return new Promise((r) => setTimeout(() => r(value), latency));
}

export const mockApi = {
  getCourses: (): Promise<Course[]> => resolve(mockCourses),
  getCourse: (id: string): Promise<Course | undefined> =>
    resolve(mockCourses.find((c) => c.id === id)),
  getLessons: (courseId: string): Promise<Lesson[]> =>
    resolve(mockLessons.filter((l) => l.courseId === courseId)),
  getGoals: (): Promise<Goal[]> => resolve(mockGoals),
  getMarks: (): Promise<Mark[]> => resolve(mockMarks),
  getMember: (): Promise<Member> => resolve(mockMember),
};

export const queryKeys = {
  courses: ["courses"] as const,
  course: (id: string) => ["courses", id] as const,
  lessons: (courseId: string) => ["lessons", courseId] as const,
  goals: ["goals"] as const,
  marks: ["marks"] as const,
  member: ["member"] as const,
};
