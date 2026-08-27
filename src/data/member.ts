export interface Member {
  name: string;
  level: string;
  streak: number;
  consistency: number;
  sessions: number;
}
export interface Mission {
  title: string;
  detail: string;
  status: "active" | "completed" | "missed" | "empty";
  due: string;
}
export interface Course {
  title: string;
  description: string;
  category: string;
  lessons: number;
  progress: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  available: boolean;
}
export interface LearningPath {
  title: string;
  description: string;
  courses: number;
  progress: number;
}
export interface Progress {
  completedLessons: number;
  totalLessons: number;
  percentage: number;
}
export interface Activity {
  label: string;
  detail: string;
  time: string;
  kind: "mark" | "lesson" | "pack";
}
export interface Session {
  title: string;
  date: string;
  time: string;
  host: string;
}

export const member: Member = {
  name: "Alex",
  level: "Foundation Builder",
  streak: 7,
  consistency: 78,
  sessions: 4,
};
export const mission: Mission = {
  title: "Complete one focused trading lesson",
  detail: "Write three lessons from your trading journal this week.",
  status: "active",
  due: "Sunday evening",
};
export const progress: Progress = { completedLessons: 12, totalLessons: 24, percentage: 50 };
export const activities: Activity[] = [
  {
    label: "Consistency Mark earned",
    detail: "You kept your word for 7 days.",
    time: "Today",
    kind: "mark",
  },
  {
    label: "Lesson completed",
    detail: "The pause before the decision",
    time: "Yesterday",
    kind: "lesson",
  },
  {
    label: "Pack note",
    detail: "Maya shared a new journal prompt.",
    time: "2 days ago",
    kind: "pack",
  },
];
export const upcomingSession: Session = {
  title: "The weekly reset",
  date: "Thursday, 28 Aug",
  time: "7:00 PM",
  host: "The Wolfpack",
};
export const accountability = {
  prompt: "What did you do today that your future self will thank you for?",
  replies: 18,
};

export const mindLabCourses: Course[] = [
  {
    title: "Emotional Control",
    description: "Notice the feeling without letting it drive.",
    category: "Mindset",
    lessons: 6,
    progress: 66,
    difficulty: "Beginner",
    available: true,
  },
  {
    title: "Discipline",
    description: "Build systems that make the right action easier.",
    category: "Mindset",
    lessons: 8,
    progress: 34,
    difficulty: "Beginner",
    available: true,
  },
  {
    title: "Consistency",
    description: "Turn small promises into an identity.",
    category: "Mindset",
    lessons: 5,
    progress: 100,
    difficulty: "Beginner",
    available: true,
  },
  {
    title: "Confidence",
    description: "Trust the process, not the outcome.",
    category: "Mindset",
    lessons: 7,
    progress: 0,
    difficulty: "Intermediate",
    available: true,
  },
  {
    title: "Resilience",
    description: "Return to the work after the setback.",
    category: "Mindset",
    lessons: 6,
    progress: 0,
    difficulty: "Intermediate",
    available: true,
  },
  {
    title: "Self-Awareness",
    description: "Understand the patterns behind your choices.",
    category: "Mindset",
    lessons: 4,
    progress: 0,
    difficulty: "Intermediate",
    available: false,
  },
  {
    title: "Focus and Deep Work",
    description: "Protect attention like it is capital.",
    category: "Mindset",
    lessons: 5,
    progress: 20,
    difficulty: "Intermediate",
    available: true,
  },
  {
    title: "Delayed Gratification",
    description: "Choose the long game on purpose.",
    category: "Mindset",
    lessons: 5,
    progress: 0,
    difficulty: "Advanced",
    available: false,
  },
];
export const tradingCourses: Course[] = [
  {
    title: "Trading Psychology",
    description: "Control your mind before you control the market.",
    category: "Trading",
    lessons: 9,
    progress: 42,
    difficulty: "Beginner",
    available: true,
  },
  {
    title: "Risk Management",
    description: "Protect your downside before seeking upside.",
    category: "Trading",
    lessons: 7,
    progress: 25,
    difficulty: "Beginner",
    available: true,
  },
  {
    title: "Market Structure",
    description: "Read context, not isolated candles.",
    category: "Trading",
    lessons: 10,
    progress: 0,
    difficulty: "Intermediate",
    available: true,
  },
  {
    title: "Trading Plan",
    description: "Make your rules visible before the session.",
    category: "Trading",
    lessons: 6,
    progress: 0,
    difficulty: "Intermediate",
    available: true,
  },
  {
    title: "Strategy Development",
    description: "Test a repeatable edge with patience.",
    category: "Trading",
    lessons: 8,
    progress: 0,
    difficulty: "Advanced",
    available: false,
  },
  {
    title: "Journaling",
    description: "Turn every session into useful evidence.",
    category: "Trading",
    lessons: 5,
    progress: 60,
    difficulty: "Beginner",
    available: true,
  },
  {
    title: "Backtesting",
    description: "Study your process before risking capital.",
    category: "Trading",
    lessons: 7,
    progress: 0,
    difficulty: "Intermediate",
    available: false,
  },
  {
    title: "Execution",
    description: "Follow the plan when pressure arrives.",
    category: "Trading",
    lessons: 6,
    progress: 0,
    difficulty: "Advanced",
    available: false,
  },
  {
    title: "Weekly Market Education",
    description: "Build context through deliberate review.",
    category: "Trading",
    lessons: 4,
    progress: 75,
    difficulty: "Beginner",
    available: true,
  },
];
export const checklist = [
  "Did I define my setup?",
  "Did I define my risk?",
  "Do I know my invalidation point?",
  "Am I trading according to my plan?",
  "Am I emotionally ready to trade?",
];
export const journalPreview = [
  "Market",
  "Setup",
  "Entry reason",
  "Risk",
  "Emotional state",
  "Result",
  "Lesson learned",
];
export const levelPaths: LearningPath[] = [
  {
    title: "Mind Lab foundation",
    description: "Build the inner discipline required to handle the outer world.",
    courses: 8,
    progress: 50,
  },
  {
    title: "Trading Room foundation",
    description: "Control your mind before you try to control the market.",
    courses: 9,
    progress: 22,
  },
];
