import type {
  CommunityCategory,
  CommunityComment,
  CommunityGuideline,
  CommunityMember,
  CommunityPost,
} from "@/types";

export const communityCategories: CommunityCategory[] = [
  { id: "all", label: "All Posts", count: 24 },
  { id: "mindset", label: "Mindset", count: 9 },
  { id: "trading", label: "Trading", count: 7 },
  { id: "discipline", label: "Discipline", count: 5 },
  { id: "wins", label: "Wins", count: 3 },
];

export const communityMembers: CommunityMember[] = [
  {
    id: "marcus",
    name: "Marcus T.",
    handle: "@marcust",
    initials: "MT",
    role: "Member",
    streak: 12,
  },
  { id: "elena", name: "Elena R.", handle: "@elenar", initials: "ER", role: "Member", streak: 28 },
  { id: "james", name: "James K.", handle: "@jamesk", initials: "JK", role: "Member", streak: 7 },
  {
    id: "aisha",
    name: "Aisha N.",
    handle: "@aishan",
    initials: "AN",
    role: "Moderator",
    streak: 41,
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: "p1",
    memberId: "marcus",
    category: "mindset",
    title: "The pause is where the work happens",
    body: "I noticed I was trying to fill every quiet moment today. Left my phone in the other room for an hour and the answer I was chasing finally showed up.",
    createdLabel: "18 min ago",
    createdAt: 4,
    likes: 18,
    comments: 4,
    bookmarked: false,
  },
  {
    id: "p2",
    memberId: "elena",
    category: "wins",
    title: "30 days of showing up",
    body: "Small win: I finished my morning routine before opening any charts. The consistency is becoming the identity, not just the goal.",
    createdLabel: "2 hours ago",
    createdAt: 3,
    likes: 34,
    comments: 8,
    bookmarked: true,
  },
  {
    id: "p3",
    memberId: "james",
    category: "trading",
    title: "Risk before reward",
    body: "Skipped a setup that did not meet my plan today. No trade, no regret. Sharing the reminder that protecting capital is a position too.",
    createdLabel: "Yesterday",
    createdAt: 2,
    likes: 27,
    comments: 6,
    bookmarked: false,
  },
  {
    id: "p4",
    memberId: "aisha",
    category: "discipline",
    title: "What are you keeping simple this week?",
    body: "The best system is the one you can repeat. I am choosing one focus block, one walk, and one honest check-in each day.",
    createdLabel: "Aug 24",
    createdAt: 1,
    likes: 22,
    comments: 3,
    bookmarked: false,
  },
];

export const communityComments: CommunityComment[] = [
  {
    id: "c1",
    postId: "p1",
    memberId: "elena",
    body: "That last line landed. Making space is a practice too.",
    createdLabel: "12 min ago",
  },
  {
    id: "c2",
    postId: "p1",
    memberId: "aisha",
    body: "Strong observation, Marcus. Keep protecting that space.",
    createdLabel: "5 min ago",
  },
  {
    id: "c3",
    postId: "p2",
    memberId: "marcus",
    body: "Thirty days is huge. You made it visible, now it is yours.",
    createdLabel: "1 hour ago",
  },
];

export const communityGuidelines: CommunityGuideline[] = [
  {
    id: "g1",
    title: "Build, do not perform",
    body: "Share honestly, celebrate progress, and leave room for other members to learn.",
  },
  {
    id: "g2",
    title: "Keep it useful",
    body: "Offer context and practical reflection instead of hot takes or pressure.",
  },
  {
    id: "g3",
    title: "Trading is education",
    body: "Trading posts are educational only. Never share or request guaranteed returns, personalized financial advice, or pressure to take a position.",
  },
];
