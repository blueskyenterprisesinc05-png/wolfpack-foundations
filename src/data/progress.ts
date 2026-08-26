import type {
  Achievement,
  CheckIn,
  Commitment,
  Mission,
  PackMember,
  ProgressMetric,
  Reflection,
  WeeklyReview,
} from "@/types";

export const progressMetrics: ProgressMetric[] = [
  { id: "mindset", category: "Mindset", percentage: 72, completed: 8, total: 11, status: "active" },
  {
    id: "trading",
    category: "Trading",
    percentage: 48,
    completed: 12,
    total: 25,
    status: "active",
  },
  {
    id: "discipline",
    category: "Discipline",
    percentage: 86,
    completed: 12,
    total: 14,
    status: "active",
  },
  {
    id: "learning",
    category: "Learning",
    percentage: 40,
    completed: 8,
    total: 20,
    status: "active",
  },
  {
    id: "accountability",
    category: "Accountability",
    percentage: 100,
    completed: 7,
    total: 7,
    status: "completed",
  },
];

export const currentMission: Mission = {
  id: "mission-14",
  title: "Protect the first hour",
  description:
    "Begin each day with your plan before the noise arrives. No charts, no feeds, just the practice.",
  status: "active",
  dueLabel: "Due today",
};

export const missions: Mission[] = [
  currentMission,
  {
    id: "mission-13",
    title: "Complete a weekly review",
    description: "Look back without judgement and choose one adjustment.",
    status: "completed",
    dueLabel: "Completed yesterday",
  },
  {
    id: "mission-12",
    title: "Hold the risk line",
    description: "Define the limit before the idea gets interesting.",
    status: "missed",
    dueLabel: "Missed 3 days ago",
  },
];

export const commitments: Commitment[] = [
  {
    id: "commit-1",
    title: "Daily market journal",
    description: "Capture the decision, the feeling and the rule followed.",
    startDate: "Aug 18",
    endDate: "Aug 24",
    completionPercentage: 86,
    status: "active",
  },
  {
    id: "commit-2",
    title: "Three focused study blocks",
    description: "Return to the Trading Room lessons without rushing the work.",
    startDate: "Aug 11",
    endDate: "Aug 17",
    completionPercentage: 100,
    status: "completed",
  },
  {
    id: "commit-3",
    title: "No revenge decisions",
    description: "Pause and reset before acting from a loss.",
    startDate: "Aug 04",
    endDate: "Aug 10",
    completionPercentage: 42,
    status: "missed",
  },
];

export const checkIns: CheckIn[] = [
  { id: "c1", dateLabel: "Mon", status: "completed" },
  { id: "c2", dateLabel: "Tue", status: "completed" },
  { id: "c3", dateLabel: "Wed", status: "partial" },
  { id: "c4", dateLabel: "Thu", status: "completed" },
  { id: "c5", dateLabel: "Fri", status: "completed" },
  { id: "c6", dateLabel: "Sat", status: "completed" },
  { id: "c7", dateLabel: "Sun", status: "pending" },
];

export const achievements: Achievement[] = [
  {
    id: "a1",
    name: "First Mission",
    description: "Complete your first daily mission.",
    state: "recent",
    earnedLabel: "Earned today",
  },
  {
    id: "a2",
    name: "Seven-Day Focus",
    description: "Show up for seven consecutive days.",
    state: "unlocked",
    earnedLabel: "Earned Aug 20",
  },
  {
    id: "a3",
    name: "Honest Review",
    description: "Submit a weekly review with care.",
    state: "unlocked",
    earnedLabel: "Earned Aug 18",
  },
  {
    id: "a4",
    name: "Consistent Learner",
    description: "Complete ten learning actions.",
    state: "locked",
  },
  {
    id: "a5",
    name: "Pack Supporter",
    description: "Encourage three Wolf Pack members.",
    state: "locked",
  },
  {
    id: "a6",
    name: "Trading Plan Complete",
    description: "Write and review your trading plan.",
    state: "locked",
  },
  {
    id: "a7",
    name: "Risk-Aware",
    description: "Complete the risk foundations track.",
    state: "locked",
  },
  {
    id: "a8",
    name: "30-Day Commitment",
    description: "Keep a commitment visible for 30 days.",
    state: "locked",
  },
];

export const packMembers: PackMember[] = [
  {
    id: "p1",
    name: "Amina Yusuf",
    initials: "AY",
    focus: "Trading process",
    commitment: "Review plan before every session",
    progressPercentage: 82,
    checkInStatus: "checked-in",
  },
  {
    id: "p2",
    name: "Daniel Reed",
    initials: "DR",
    focus: "Daily discipline",
    commitment: "Protect the first hour",
    progressPercentage: 64,
    checkInStatus: "needs-support",
  },
  {
    id: "p3",
    name: "Lerato Mokoena",
    initials: "LM",
    focus: "Emotional awareness",
    commitment: "Complete the evening reflection",
    progressPercentage: 91,
    checkInStatus: "checked-in",
  },
];

export const reflections: Reflection[] = [
  {
    id: "r1",
    prompt: "What are you noticing about your consistency?",
    response: "The pause is getting easier to find when I write before I act.",
    dateLabel: "Last reflection · Aug 23",
  },
];
export const weeklyReview: WeeklyReview = {
  id: "review-1",
  weekLabel: "Week of Aug 18",
  responses: {},
  submitted: false,
};

export const progressHistory = [68, 72, 65, 78, 81, 84, 88, 92];
