export type LessonState = "locked" | "in-progress" | "complete";
export type GoalStatus = "active" | "completed" | "missed";
export type MembershipTier = "free" | "member" | "inner-circle";
export type CourseCategory = "Mind Lab" | "Trading Room";

export interface Instructor {
  id: string;
  name: string;
  bio: string;
  initials: string;
}

export interface CourseObjective {
  id: string;
  courseId: string;
  label: string;
}

export interface Resource {
  id: string;
  lessonId: string;
  title: string;
  type: "worksheet" | "guide" | "template";
}

export interface CourseProgress {
  courseId: string;
  completedLessons: number;
  currentLessonId?: string;
  started: boolean;
}

export interface LessonProgress {
  lessonId: string;
  status: "not-started" | "in-progress" | "complete";
  notes: string;
  updatedAt?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  durationMinutes: number;
  order: number;
  state: LessonState;
  summary?: string;
  description?: string;
  content?: LessonContent;
}

export interface LessonContent {
  introduction: string;
  teaching: string[];
  example: { title: string; body: string };
  exercise: string;
  takeaways: string[];
  reflection: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  level: "foundation" | "intermediate" | "advanced";
  lessonCount: number;
  lessonsComplete: number;
  tier: MembershipTier;
  category: CourseCategory;
  description: string;
  coverLabel: string;
  instructorId: string;
  durationMinutes: number;
  objectives: string[];
}

export interface Goal {
  id: string;
  title: string;
  metric: string;
  target: number;
  current: number;
  status: GoalStatus;
  dueLabel: string;
}

export interface Mark {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedLabel?: string;
}

export interface Progress {
  streakDays: number;
  bestStreakDays: number;
  consistencyPct: number;
  checkedInToday: boolean;
  lessonsCompleted: number;
  marksEarned: number;
}

export interface Member {
  id: string;
  name: string;
  handle: string;
  tier: MembershipTier;
  joinedLabel: string;
  progress: Progress;
}
