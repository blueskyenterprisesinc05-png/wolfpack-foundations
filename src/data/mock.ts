import type {
  Course,
  CourseObjective,
  CourseProgress,
  Instructor,
  Lesson,
  LessonProgress,
  Mark,
  Member,
  Resource,
} from "@/types";

export const mockInstructors: Instructor[] = [
  {
    id: "i1",
    name: "Maya Okafor",
    initials: "MO",
    bio: "A performance coach helping members build calm, repeatable practices for high-pressure decisions.",
  },
  {
    id: "i2",
    name: "Jon Bell",
    initials: "JB",
    bio: "A risk educator focused on process, position sizing and the habits that keep traders in the game.",
  },
];

const mindLessons: Lesson[] = [
  {
    id: "ml1",
    courseId: "mind-lab",
    title: "The Mind Is the First Market",
    description: "Notice the stories running underneath every decision.",
    durationMinutes: 12,
    order: 1,
    state: "complete",
    summary: "A grounded introduction to attention and choice.",
    content: {
      introduction: "Before we can change a behaviour, we need to notice the moment it begins.",
      teaching: [
        "Attention is a limited resource. What you repeatedly notice becomes what you repeatedly practise.",
        "Emotional awareness is not a demand to feel less. It is the ability to name what is present without handing it the steering wheel.",
      ],
      example: {
        title: "A small pause",
        body: "You feel the urge to abandon a routine. Rather than arguing with the urge, name it: ‘I am feeling resistance.’ That small act creates room for a different response.",
      },
      exercise:
        "Set a two-minute timer. Write down three sensations, two emotions and one thought without trying to fix any of them.",
      takeaways: [
        "Notice before you navigate.",
        "Naming a feeling is not the same as obeying it.",
        "Small pauses compound.",
      ],
      reflection: "What did you notice today that you normally rush past?",
    },
  },
  {
    id: "ml2",
    courseId: "mind-lab",
    title: "Understanding Emotional Triggers",
    description: "Map the moments that pull you away from your intention.",
    durationMinutes: 18,
    order: 2,
    state: "in-progress",
    summary: "Build a useful map of your triggers and responses.",
    content: {
      introduction:
        "Triggers are signals, not verdicts. They show us where attention and care are needed.",
      teaching: [
        "A trigger usually arrives before the story we tell about it. Learning the sequence gives you a place to intervene.",
        "Use the chain: event, sensation, interpretation, impulse, choice. The choice is the part you can train.",
      ],
      example: {
        title: "The unanswered message",
        body: "An unanswered message becomes a tight chest, then a story about rejection, then an impulse to send three more messages. The pause lives between the sensation and the story.",
      },
      exercise:
        "Complete one trigger chain from the last 24 hours. Circle the first point where a pause could have changed your next action.",
      takeaways: [
        "Triggers are information.",
        "The body often notices first.",
        "One pause is a successful practice.",
      ],
      reflection: "Which interpretation do you reach for most quickly?",
    },
  },
  {
    id: "ml3",
    courseId: "mind-lab",
    title: "Discipline When Motivation Fades",
    description: "Make the next right action smaller than the resistance.",
    durationMinutes: 16,
    order: 3,
    state: "locked",
    summary: "Design consistency for ordinary days.",
  },
  {
    id: "ml4",
    courseId: "mind-lab",
    title: "Building a Consistent Routine",
    description: "Create a practice that can survive a busy week.",
    durationMinutes: 20,
    order: 4,
    state: "locked",
    summary: "Turn intention into a repeatable ritual.",
  },
  {
    id: "ml5",
    courseId: "mind-lab",
    title: "The Weekly Self-Review",
    description: "Review setbacks with honesty and without punishment.",
    durationMinutes: 15,
    order: 5,
    state: "locked",
    summary: "Use reflection to improve the next week.",
  },
];

const tradingLessons: Lesson[] = [
  {
    id: "tr1",
    courseId: "trading-room",
    title: "Your Emotions Are Part of the Trade",
    description: "Build awareness before you build a position.",
    durationMinutes: 14,
    order: 1,
    state: "complete",
    summary: "A process-first look at trading psychology.",
  },
  {
    id: "tr2",
    courseId: "trading-room",
    title: "Risk Before Reward",
    description: "Define what you can lose before considering what you could make.",
    durationMinutes: 22,
    order: 2,
    state: "complete",
    summary: "Risk management is the foundation of survival.",
    content: {
      introduction:
        "A trade is not defined by its upside. It is defined first by the risk you are willing and able to carry.",
      teaching: [
        "Risk is a decision made before entry, not a feeling managed after the market moves.",
        "A simple plan makes risk visible: invalidation, position size, maximum loss and the conditions that end the idea.",
      ],
      example: {
        title: "The clean pass",
        body: "A setup looks attractive, but its invalidation sits too far away for your defined risk. The process-first decision is to pass, not to stretch the rules.",
      },
      exercise:
        "On paper, write a hypothetical setup and define the invalidation, maximum loss and exact reason you would walk away.",
      takeaways: [
        "Risk comes before reward.",
        "A pass can be a high-quality decision.",
        "Paper practice builds clarity without capital at risk.",
      ],
      reflection: "Where are you most tempted to negotiate with your own risk limit?",
    },
  },
  {
    id: "tr3",
    courseId: "trading-room",
    title: "Building a Trading Plan",
    description: "Turn vague confidence into observable rules.",
    durationMinutes: 24,
    order: 3,
    state: "in-progress",
    summary: "Write a plan you can actually review.",
  },
  {
    id: "tr4",
    courseId: "trading-room",
    title: "The Purpose of a Trading Journal",
    description: "Capture decisions, not just outcomes.",
    durationMinutes: 17,
    order: 4,
    state: "locked",
    summary: "Journal for feedback, not self-judgement.",
  },
  {
    id: "tr5",
    courseId: "trading-room",
    title: "Reviewing a Losing Trade",
    description: "Separate process quality from outcome noise.",
    durationMinutes: 19,
    order: 5,
    state: "locked",
    summary: "Learn without letting ego edit the record.",
  },
  {
    id: "tr6",
    courseId: "trading-room",
    title: "Practising Before Risking Capital",
    description: "Rehearse the process before adding pressure.",
    durationMinutes: 21,
    order: 6,
    state: "locked",
    summary: "Paper practice before real risk.",
  },
];

export const mockCourses: Course[] = [
  {
    id: "mind-lab",
    title: "Mind Lab",
    subtitle: "Build the inner habits that make consistency possible.",
    category: "Mind Lab",
    description:
      "A five-part practice for emotional awareness, focus and honest self-review. Progress is built in ordinary moments.",
    level: "foundation",
    lessonCount: 5,
    lessonsComplete: 2,
    tier: "free",
    coverLabel: "Awareness / Practice",
    instructorId: "i1",
    durationMinutes: 81,
    objectives: [
      "Recognise emotional triggers.",
      "Build a consistent daily practice.",
      "Improve focus and self-awareness.",
      "Respond instead of reacting.",
      "Review setbacks honestly.",
    ],
  },
  {
    id: "trading-room",
    title: "Trading Room",
    subtitle: "Process over prediction. Risk before reward.",
    category: "Trading Room",
    description:
      "An educational track for building a grounded trading process, from risk definition to objective review.",
    level: "intermediate",
    lessonCount: 6,
    lessonsComplete: 2,
    tier: "member",
    coverLabel: "Process / Risk",
    instructorId: "i2",
    durationMinutes: 117,
    objectives: [
      "Understand the role of trading psychology.",
      "Create a basic trading plan.",
      "Define and manage risk.",
      "Journal trading decisions.",
      "Review execution objectively.",
    ],
  },
];

export const mockLessons: Lesson[] = [...mindLessons, ...tradingLessons];
export const mockObjectives: CourseObjective[] = mockCourses.flatMap((course) =>
  course.objectives.map((label, index) => ({
    id: `${course.id}-objective-${index}`,
    courseId: course.id,
    label,
  })),
);
export const mockResources: Resource[] = [
  { id: "r1", lessonId: "ml2", title: "Trigger mapping worksheet", type: "worksheet" },
  { id: "r2", lessonId: "tr2", title: "Risk planning template", type: "template" },
];
export const mockCourseProgress: CourseProgress[] = [
  { courseId: "mind-lab", completedLessons: 2, currentLessonId: "ml2", started: true },
  { courseId: "trading-room", completedLessons: 2, currentLessonId: "tr3", started: true },
];
export const mockLessonProgress: LessonProgress[] = mockLessons.map((lesson) => ({
  lessonId: lesson.id,
  status:
    lesson.state === "complete"
      ? "complete"
      : lesson.state === "in-progress"
        ? "in-progress"
        : "not-started",
  notes: "",
}));

export const mockGoals = [
  {
    id: "g1",
    title: "Journal every session",
    metric: "sessions",
    target: 20,
    current: 14,
    status: "active" as const,
    dueLabel: "This month",
  },
  {
    id: "g2",
    title: "Hold 1% max risk",
    metric: "trades",
    target: 40,
    current: 40,
    status: "completed" as const,
    dueLabel: "Last month",
  },
  {
    id: "g3",
    title: "Pre-market prep by 07:00",
    metric: "days",
    target: 21,
    current: 9,
    status: "missed" as const,
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
