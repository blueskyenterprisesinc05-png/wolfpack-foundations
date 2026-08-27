import type {
  MembershipInfo,
  MemberProfile,
  ProfileActivity,
  ProfileFaq,
  ProfileMark,
  ProfilePreferences,
} from "@/types";

export const memberProfile: MemberProfile = {
  id: "member-1",
  name: "Alex Morgan",
  handle: "@alexmorgan",
  initials: "AM",
  role: "Founding Member",
  bio: "Building consistency through deliberate practice, clear thinking, and honest review.",
  location: "New York, NY",
  joinedLabel: "Joined January 2025",
  tier: "member",
  streak: 12,
  totalMarks: 8,
  completedLessons: 14,
  accountabilityScore: 86,
};
export const profileActivity: ProfileActivity[] = [
  {
    id: "a1",
    label: "Completed Mind Lab lesson",
    detail: "Pattern Recognition",
    dateLabel: "Today",
    tone: "gold",
  },
  {
    id: "a2",
    label: "Checked in with The Pack",
    detail: "Weekly accountability",
    dateLabel: "Yesterday",
    tone: "green",
  },
  {
    id: "a3",
    label: "Earned a Mark",
    detail: "First Principles",
    dateLabel: "3 days ago",
    tone: "gold",
  },
  {
    id: "a4",
    label: "Missed a commitment",
    detail: "Morning review",
    dateLabel: "5 days ago",
    tone: "red",
  },
];
export const profileMarks: ProfileMark[] = [
  {
    id: "m1",
    title: "First Principles",
    description: "Completed your first Mind Lab sequence.",
    earnedLabel: "Earned Mar 08, 2026",
    category: "Mind Lab",
  },
  {
    id: "m2",
    title: "Steady Hand",
    description: "Kept a seven-day practice streak.",
    earnedLabel: "Earned Feb 24, 2026",
    category: "Discipline",
  },
  {
    id: "m3",
    title: "Pack Presence",
    description: "Showed up for five community check-ins.",
    earnedLabel: "Earned Feb 12, 2026",
    category: "Community",
  },
];
export const profilePreferences: ProfilePreferences = {
  weeklyReview: true,
  sessionReminders: true,
  communityUpdates: false,
  profileVisibility: "members",
};
export const membershipInfo: MembershipInfo = {
  tier: "member",
  status: "active",
  renewalLabel: "Renews January 12, 2027",
  benefits: [
    "Full access to Mind Lab",
    "Trading Room education",
    "The Pack community",
    "Member-only Wolf Sessions",
  ],
};
export const profileFaqs: ProfileFaq[] = [
  {
    id: "f1",
    question: "How do I change my membership?",
    answer:
      "Membership changes are handled by the team so we can help you choose the right level of support.",
  },
  {
    id: "f2",
    question: "Who can see my profile?",
    answer:
      "Your profile is visible to members by default. You can change this to private in Settings.",
  },
  {
    id: "f3",
    question: "Can I export my activity?",
    answer:
      "This demo uses local-only data. Export and account data controls will be connected in a later phase.",
  },
];
