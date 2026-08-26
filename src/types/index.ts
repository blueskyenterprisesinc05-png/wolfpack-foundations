export type LessonState = "locked" | "in-progress" | "complete";
export type GoalStatus = "active" | "completed" | "missed";
export type MembershipTier = "free" | "member" | "inner-circle";

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  durationMinutes: number;
  order: number;
  state: LessonState;
  summary?: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  level: "foundation" | "intermediate" | "advanced";
  lessonCount: number;
  lessonsComplete: number;
  tier: MembershipTier;
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
