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

export interface LessonChecklistItem {
  id: string;
  label: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  moduleLabel: string;
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
  checklist?: LessonChecklistItem[];
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

export interface ProgressMetric {
  id: string;
  category: "Mindset" | "Trading" | "Discipline" | "Learning" | "Accountability";
  percentage: number;
  completed: number;
  total: number;
  status: "completed" | "active" | "not-started";
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "missed" | "none";
  dueLabel: string;
}

export interface Commitment {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  completionPercentage: number;
  status: "active" | "completed" | "missed";
}

export interface CheckIn {
  id: string;
  dateLabel: string;
  status: "completed" | "partial" | "not-completed" | "support-needed";
}

export interface Reflection {
  id: string;
  prompt: string;
  response: string;
  dateLabel: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  state: "locked" | "unlocked" | "recent";
  earnedLabel?: string;
}

export interface PackMember {
  id: string;
  name: string;
  initials: string;
  focus: string;
  commitment: string;
  progressPercentage: number;
  checkInStatus: "checked-in" | "needs-support" | "pending";
}

export interface WeeklyReview {
  id: string;
  weekLabel: string;
  responses: Record<string, string>;
  submitted: boolean;
}

export interface CommunityCategory {
  id: string;
  label: string;
  count: number;
}
export interface CommunityMember {
  id: string;
  name: string;
  handle: string;
  initials: string;
  role: "Member" | "Moderator";
  streak: number;
}
export interface CommunityPost {
  id: string;
  memberId: string;
  category: string;
  title: string;
  body: string;
  createdLabel: string;
  createdAt: number;
  likes: number;
  comments: number;
  bookmarked: boolean;
}
export interface CommunityComment {
  id: string;
  postId: string;
  memberId: string;
  body: string;
  createdLabel: string;
}
export interface CommunityGuideline {
  id: string;
  title: string;
  body: string;
}

export type SessionCategory =
  | "Mindset"
  | "Trading Psychology"
  | "Risk Management"
  | "Discipline"
  | "Learning"
  | "Accountability"
  | "Pack Review";
export type SessionStatus = "upcoming" | "past" | "full";
export interface SessionHost {
  id: string;
  name: string;
  initials: string;
  role: string;
  bio: string;
}
export interface SessionResource {
  id: string;
  sessionId: string;
  label: string;
  type: "checklist" | "worksheet" | "recording";
}
export interface SessionAttendance {
  sessionId: string;
  status: "registered" | "cancelled" | "none";
  addedToSchedule: boolean;
}
export interface Session {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: SessionCategory;
  hostId: string;
  dateLabel: string;
  dateValue: number;
  timeLabel: string;
  durationMinutes: number;
  status: SessionStatus;
  attendeeCount: number;
  capacity: number;
  recordingAvailable: boolean;
  learningPoints: string[];
  preparation: string[];
}

export interface MemberProfile {
  id: string;
  name: string;
  handle: string;
  initials: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  location?: string;
  joinedLabel?: string;
  role?: string;
  tier?: MembershipTier;
  streak?: number;
  totalMarks?: number;
  completedLessons?: number;
  accountabilityScore?: number;
}
export interface ProfileActivity {
  id: string;
  label: string;
  detail: string;
  dateLabel: string;
  tone: "gold" | "green" | "red";
}
export interface ProfileMark {
  id: string;
  title: string;
  description: string;
  earnedLabel: string;
  category: string;
}
export interface ProfilePreferences {
  weeklyReview: boolean;
  sessionReminders: boolean;
  communityUpdates: boolean;
  profileVisibility: "members" | "private";
}
export interface MembershipInfo {
  tier: MembershipTier;
  status: "active" | "trial";
  renewalLabel: string;
  benefits: string[];
}
export interface ProfileFaq {
  id: string;
  question: string;
  answer: string;
}
