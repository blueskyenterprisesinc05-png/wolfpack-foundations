import type {
  Session,
  SessionAttendance,
  SessionCategory,
  SessionHost,
  SessionResource,
} from "@/types";

export const sessionCategories: SessionCategory[] = [
  "Mindset",
  "Trading Psychology",
  "Risk Management",
  "Discipline",
  "Learning",
  "Accountability",
  "Pack Review",
];

export const sessionHosts: SessionHost[] = [
  {
    id: "host-marcus",
    name: "Marcus Cole",
    initials: "MC",
    role: "Founder & Lead Facilitator",
    bio: "Helping ambitious people turn intention into repeatable action.",
  },
  {
    id: "host-anya",
    name: "Anya Brooks",
    initials: "AB",
    role: "Mindset Coach",
    bio: "A practical guide for clearer thinking under pressure.",
  },
  {
    id: "host-daniel",
    name: "Daniel Okafor",
    initials: "DO",
    role: "Trading Psychology Lead",
    bio: "Teaching process, risk awareness, and responsible learning.",
  },
];

const details = [
  "Name the pattern before you try to change it.",
  "Build a process you can follow on an ordinary day.",
  "Leave with one practical action for the week.",
];

export const mockSessions: Session[] = [
  {
    id: "session-emotional-control",
    title: "Emotional Control Under Pressure",
    description: "A practical conversation about staying clear when the stakes feel high.",
    fullDescription:
      "We will examine the moments that pull you away from your process and build a simple reset ritual you can use before your next decision.",
    category: "Trading Psychology",
    hostId: "host-daniel",
    dateLabel: "Today, 7:00 PM",
    dateValue: 1,
    timeLabel: "7:00 PM – 8:00 PM",
    durationMinutes: 60,
    status: "upcoming",
    attendeeCount: 18,
    capacity: 24,
    recordingAvailable: false,
    learningPoints: details,
    preparation: [
      "Bring one recent pressure moment",
      "Review your last journal entry",
      "Arrive with one honest question",
    ],
  },
  {
    id: "session-trading-plan",
    title: "Building Your Trading Plan",
    description: "Turn scattered ideas into a calm, written process for responsible learning.",
    fullDescription:
      "This is a planning workshop, not a signal room. We will map your rules, risk boundaries, and review rhythm so your attention stays on process.",
    category: "Risk Management",
    hostId: "host-daniel",
    dateLabel: "Tomorrow, 6:30 PM",
    dateValue: 2,
    timeLabel: "6:30 PM – 7:30 PM",
    durationMinutes: 60,
    status: "upcoming",
    attendeeCount: 21,
    capacity: 24,
    recordingAvailable: false,
    learningPoints: [
      "Separate risk from reward",
      "Define a reviewable process",
      "Create a personal stop rule",
    ],
    preparation: ["Bring your current plan", "Write down your non-negotiables"],
  },
  {
    id: "session-pack-review",
    title: "The Weekly Pack Review",
    description: "Look back together, name the wins, and choose the next right step.",
    fullDescription:
      "A grounded weekly review for members who want accountability without performance theatre. Bring progress, friction, and one commitment for next week.",
    category: "Pack Review",
    hostId: "host-marcus",
    dateLabel: "Thursday, 7:00 PM",
    dateValue: 4,
    timeLabel: "7:00 PM – 8:00 PM",
    durationMinutes: 60,
    status: "upcoming",
    attendeeCount: 24,
    capacity: 24,
    recordingAvailable: false,
    learningPoints: [
      "Review the week without judgment",
      "Share one useful lesson",
      "Set a focused next step",
    ],
    preparation: ["Complete your weekly reflection", "Bring one win and one lesson"],
  },
  {
    id: "session-consistency",
    title: "Staying Consistent When Motivation Disappears",
    description: "Build a minimum standard that survives low-energy days.",
    fullDescription:
      "Motivation is a visitor. In this session we will design the small, repeatable commitments that keep your identity moving forward when enthusiasm fades.",
    category: "Discipline",
    hostId: "host-anya",
    dateLabel: "Saturday, 10:00 AM",
    dateValue: 6,
    timeLabel: "10:00 AM – 11:00 AM",
    durationMinutes: 60,
    status: "upcoming",
    attendeeCount: 12,
    capacity: 20,
    recordingAvailable: false,
    learningPoints: [
      "Design a minimum day",
      "Use friction to your advantage",
      "Recover without restarting",
    ],
    preparation: ["Notice where your routine breaks"],
  },
  {
    id: "session-month-review",
    title: "Reviewing Your Month",
    description: "A recorded reflection for seeing the pattern, not just the outcome.",
    fullDescription:
      "Use this guided review to look at your decisions, attention, and follow-through. The goal is useful feedback—not a verdict on your worth.",
    category: "Learning",
    hostId: "host-marcus",
    dateLabel: "Last Sunday",
    dateValue: -7,
    timeLabel: "Recording · 42 min",
    durationMinutes: 42,
    status: "past",
    attendeeCount: 31,
    capacity: 40,
    recordingAvailable: true,
    learningPoints: [
      "Find the recurring pattern",
      "Separate facts from stories",
      "Choose one experiment",
    ],
    preparation: ["Download the monthly review worksheet"],
  },
  {
    id: "session-focus",
    title: "How to Learn Without Losing Focus",
    description: "Make your learning diet smaller, clearer, and easier to finish.",
    fullDescription:
      "We will talk about information overload, useful constraints, and how to close loops instead of collecting more inputs.",
    category: "Learning",
    hostId: "host-anya",
    dateLabel: "Last Tuesday",
    dateValue: -10,
    timeLabel: "Recording · 38 min",
    durationMinutes: 38,
    status: "past",
    attendeeCount: 26,
    capacity: 40,
    recordingAvailable: true,
    learningPoints: ["Choose a learning target", "Protect attention", "Turn notes into action"],
    preparation: ["Bring your open tabs list"],
  },
];

export const mockAttendance: SessionAttendance[] = [
  { sessionId: "session-pack-review", status: "registered", addedToSchedule: true },
];
export const mockSessionResources: SessionResource[] = [
  {
    id: "resource-month",
    sessionId: "session-month-review",
    label: "Monthly review worksheet",
    type: "worksheet",
  },
  {
    id: "resource-plan",
    sessionId: "session-trading-plan",
    label: "Planning checklist",
    type: "checklist",
  },
];
