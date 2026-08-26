import type { Course, Goal, Lesson, Mark, Member } from "@/types";

export const mockCourses: Course[] = [
  {
    id: "c1",
    title: "Risk First",
    subtitle: "Position sizing, drawdown limits and the maths of survival.",
    level: "foundation",
    lessonCount: 12,
    lessonsComplete: 9,
    tier: "free",
  },
  {
    id: "c2",
    title: "Reading Structure",
    subtitle: "Market structure without indicators or prediction.",
    level: "intermediate",
    lessonCount: 16,
    lessonsComplete: 4,
    tier: "member",
  },
  {
    id: "c3",
    title: "The Discipline Engine",
    subtitle: "Building a routine that survives losing weeks.",
    level: "advanced",
    lessonCount: 10,
    lessonsComplete: 0,
    tier: "inner-circle",
  },
];

export const mockLessons: Lesson[] = [
  {
    id: "l1",
    courseId: "c1",
    title: "Why most accounts die in month three",
    durationMinutes: 14,
    order: 1,
    state: "complete",
  },
  {
    id: "l2",
    courseId: "c1",
    title: "Fixed fractional sizing",
    durationMinutes: 22,
    order: 2,
    state: "in-progress",
  },
  {
    id: "l3",
    courseId: "c1",
    title: "Drawdown circuit breakers",
    durationMinutes: 18,
    order: 3,
    state: "locked",
  },
];

export const mockGoals: Goal[] = [
  {
    id: "g1",
    title: "Journal every session",
    metric: "sessions",
    target: 20,
    current: 14,
    status: "active",
    dueLabel: "This month",
  },
  {
    id: "g2",
    title: "Hold 1% max risk",
    metric: "trades",
    target: 40,
    current: 40,
    status: "completed",
    dueLabel: "Last month",
  },
  {
    id: "g3",
    title: "Pre-market prep by 07:00",
    metric: "days",
    target: 21,
    current: 9,
    status: "missed",
    dueLabel: "Broken Tuesday",
  },
];

export const mockMarks: Mark[] = [
  {
    id: "m1",
    name: "First Blood",
    description: "Completed your first lesson.",
    earned: true,
    earnedLabel: "Earned Mar 4",
  },
  {
    id: "m2",
    name: "Thirty Nights",
    description: "30-day unbroken check-in streak.",
    earned: true,
    earnedLabel: "Earned Apr 12",
  },
  {
    id: "m3",
    name: "Iron Rules",
    description: "90 days without a risk-limit breach.",
    earned: false,
  },
];

export const mockMember: Member = {
  id: "u1",
  name: "Demo Member",
  handle: "@demo",
  tier: "member",
  joinedLabel: "Joined March 2026",
  progress: {
    streakDays: 34,
    bestStreakDays: 51,
    consistencyPct: 78,
    checkedInToday: true,
    lessonsCompleted: 13,
    marksEarned: 2,
  },
};
