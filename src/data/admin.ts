export interface AdminMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "steady";
  accent: "gold" | "forest" | "crimson" | "muted";
}

export interface ActivityPoint {
  label: string;
  members: number;
  checkIns: number;
}

export interface LearningPathPerformance {
  id: string;
  name: string;
  enrolled: number;
  completion: number;
  momentum: string;
}

export interface RecentActivity {
  id: string;
  member: string;
  initials: string;
  action: string;
  detail: string;
  time: string;
  type: "learning" | "community" | "check-in";
  status: "New" | "Reviewed";
}

export interface AdminSession {
  id: string;
  title: string;
  date: string;
  time: string;
  attendees: number;
  capacity: number;
  host: string;
  status: "Open" | "Waitlist";
}

export interface CommunityHealth {
  label: string;
  value: string;
  note: string;
  score: number;
  tone: "forest" | "gold" | "crimson";
}

export interface AdminNotification {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: "gold" | "crimson" | "forest";
}

export const adminMetrics: AdminMetric[] = [
  {
    id: "members",
    label: "Total members",
    value: "2,418",
    change: "+8.4%",
    trend: "up",
    accent: "gold",
  },
  {
    id: "active",
    label: "Active members",
    value: "1,746",
    change: "+12.1%",
    trend: "up",
    accent: "forest",
  },
  {
    id: "new",
    label: "New this month",
    value: "184",
    change: "+16.8%",
    trend: "up",
    accent: "crimson",
  },
  {
    id: "completion",
    label: "Course completion",
    value: "68.4%",
    change: "+4.2%",
    trend: "up",
    accent: "gold",
  },
  {
    id: "checkins",
    label: "Weekly check-ins",
    value: "1,203",
    change: "+9.6%",
    trend: "up",
    accent: "forest",
  },
  {
    id: "posts",
    label: "Community posts",
    value: "486",
    change: "+5.3%",
    trend: "up",
    accent: "muted",
  },
  {
    id: "sessions",
    label: "Upcoming sessions",
    value: "12",
    change: "3 this week",
    trend: "steady",
    accent: "crimson",
  },
];

export const activityPoints: ActivityPoint[] = [
  { label: "Mon", members: 920, checkIns: 610 },
  { label: "Tue", members: 1040, checkIns: 702 },
  { label: "Wed", members: 980, checkIns: 644 },
  { label: "Thu", members: 1210, checkIns: 804 },
  { label: "Fri", members: 1300, checkIns: 860 },
  { label: "Sat", members: 1160, checkIns: 744 },
  { label: "Sun", members: 1450, checkIns: 980 },
];

export const learningPathPerformance: LearningPathPerformance[] = [
  { id: "mind-lab", name: "Mind Lab", enrolled: 1420, completion: 78, momentum: "+6.8%" },
  { id: "trading-room", name: "Trading Room", enrolled: 1184, completion: 64, momentum: "+3.2%" },
  {
    id: "wolfpack",
    name: "Foundations",
    enrolled: 864,
    completion: 52,
    momentum: "+9.4%",
  },
];

export const recentActivity: RecentActivity[] = [
  {
    id: "a1",
    member: "Amara Lewis",
    initials: "AL",
    action: "Completed a lesson",
    detail: "The Weekly Self-Review",
    time: "8 min ago",
    type: "learning",
    status: "New",
  },
  {
    id: "a2",
    member: "Jordan Bell",
    initials: "JB",
    action: "Posted in community",
    detail: "Shared a reflection in Daily Practice",
    time: "22 min ago",
    type: "community",
    status: "New",
  },
  {
    id: "a3",
    member: "Nia Carter",
    initials: "NC",
    action: "Checked in",
    detail: "Week 04 · Consistency practice",
    time: "41 min ago",
    type: "check-in",
    status: "Reviewed",
  },
  {
    id: "a4",
    member: "Theo Grant",
    initials: "TG",
    action: "Started a path",
    detail: "Trading Room",
    time: "1 hr ago",
    type: "learning",
    status: "New",
  },
  {
    id: "a5",
    member: "Sofia James",
    initials: "SJ",
    action: "Posted in community",
    detail: "Asked for feedback on her routine",
    time: "2 hrs ago",
    type: "community",
    status: "Reviewed",
  },
];

export const upcomingSessions: AdminSession[] = [
  {
    id: "s1",
    title: "The Sunday Reset",
    date: "Sun, Mar 16",
    time: "10:00 AM",
    attendees: 84,
    capacity: 100,
    host: "Maya Okafor",
    status: "Open",
  },
  {
    id: "s2",
    title: "Trading With Intention",
    date: "Tue, Mar 18",
    time: "6:30 PM",
    attendees: 46,
    capacity: 50,
    host: "Jon Bell",
    status: "Open",
  },
  {
    id: "s3",
    title: "Community Office Hours",
    date: "Thu, Mar 20",
    time: "12:00 PM",
    attendees: 50,
    capacity: 50,
    host: "Maya Okafor",
    status: "Waitlist",
  },
];

export const communityHealth: CommunityHealth[] = [
  {
    label: "Weekly participation",
    value: "72%",
    note: "+4.8% from last week",
    score: 72,
    tone: "forest",
  },
  {
    label: "Helpful responses",
    value: "89%",
    note: "Members feel supported",
    score: 89,
    tone: "gold",
  },
  { label: "Needs attention", value: "14", note: "Unreviewed reports", score: 14, tone: "crimson" },
];

export const adminNotifications: AdminNotification[] = [
  {
    id: "n1",
    title: "14 posts need review",
    detail: "Community moderation queue",
    time: "12 min ago",
    tone: "crimson",
  },
  {
    id: "n2",
    title: "Session capacity reached",
    detail: "Community Office Hours · Thu, Mar 20",
    time: "1 hr ago",
    tone: "gold",
  },
  {
    id: "n3",
    title: "Weekly digest ready",
    detail: "Your member activity summary is ready",
    time: "Yesterday",
    tone: "forest",
  },
];

export const adminNav = [
  "Overview",
  "Members",
  "Learning Content",
  "Wolf Sessions",
  "Community",
  "Analytics",
  "Settings",
] as const;
export type AdminNavItem = (typeof adminNav)[number];
