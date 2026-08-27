import { mockCourses, mockGoals, mockLessons, mockMarks, mockMember } from "@/data/mock";
import type { Course, Goal, Instructor, Lesson, Mark, Member, Resource } from "@/types";
import { mockInstructors, mockResources } from "@/data/mock";

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
  getLesson: (id: string): Promise<Lesson | undefined> =>
    resolve(mockLessons.find((lesson) => lesson.id === id)),
  getInstructor: (id: string): Promise<Instructor | undefined> =>
    resolve(mockInstructors.find((instructor) => instructor.id === id)),
  getResources: (lessonId: string): Promise<Resource[]> =>
    resolve(mockResources.filter((resource) => resource.lessonId === lessonId)),
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
